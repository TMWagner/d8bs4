<?php
/**
 * Created by PhpStorm.
 * User: thomaswagner
 * Date: 2019-01-27
 * Time: 10:10.
 *
 * Render properties:
 * https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Render%21Element%21RenderElement.php/class/RenderElement/8.6.x
 */

namespace Drupal\people\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ReplaceCommand;
use Symfony\Component\HttpFoundation\Response;



/**
 * Class PeopleController
 *
 * @package Drupal\people\Controller
 */
class PeopleController extends ControllerBase {

  /**
   * @return mixed
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function noargs() {
    // Just dev/test content
    $uid = '133';
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';


    $view_output = views_embed_view($profile_id, $display_id, $uid);

    $page['profile']['bio_mobile'] = array(
      '#type' => 'block',
      'content' => [
        'system_main' => $view_output,
      ],
      '#prefix' => '<div class="mobile-display">',
      '#suffix' => '</div>',
    );

    $nid = 169;
    $entity_type = 'node';
    $view_mode = 'teaser';
    $view_builder = \Drupal::entityTypeManager()->getViewBuilder($entity_type);
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);
    $node = $storage->load($nid);
    $build = $view_builder->view($node, $view_mode);
    $output = render($build);

    /**
     * Dev block: Creates a renderable object from a block
     * Notes: Get the name of the profile by opening "configure block"
     * @todo Remove before production.  Also;  Should check to make sure block exists.
     *
     * Would like to be able to do this with a View!!!!!!
     *
     */

    $block_id = 'searchform';
    $entity_type = 'block';
    $view_builder = \Drupal::entityTypeManager()->getViewBuilder($entity_type);
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);
    $node = $storage->load($block_id);
    $build = $view_builder->view($node);
    $output = render($build);

    $page['page'] = [
      '#type' => 'markup',
      '#markup' => $output,
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];
    return $page;
  }

  /**
   * @param $uid
   *
   * @return mixed
   */
  public function profile($uid) {

    // Set view arguments
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';

    // Load view object
    // Need graceful recovery if View doesn't exist
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    //  Build the basic profile display
    //  Added "Row" to sibling DIV with "container.html.twig"
    $render_array['profile'] = array (
      '#type' => 'container',
      '#prefix' => '<div class="profile-bio-link-wrap not-mobile-display container">',
      '#suffix' => '</div>',
    );

    $render_array['profile']['profile_static'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
      '#prefix' => '<div class="profile_bio_static col">',
      '#suffix' => '</div>',
    ];
    //  Build the initial bio - This will be replaced
    $render_array['profile']['profile_dynamic'] = [
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div class="people_bio_dynamic col"><div class="profile-swap">',
      '#suffix' => '</div></div>',
    ];


    // Publications test
    $name = 'publications_listings';
    $display_id = 'publications_uid';


    //Test for publications
    $publications = TRUE;
    $test_for_publications = views_get_view_result($name, $display_id, $uid);
    if (empty($test_for_publications)) {
      // Build publications link here...
      //@todo We don't need the publications var: just do it or not.
      $publications = FALSE;
    }


    /**
     * Build conditional AJAX links as needed
     */

    // -> Bio LINK
    $render_array['ajax_link']['link']['bio'] = [
      '#type' => 'link',
      '#title' => $this->t('Bio'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax']],
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'bio',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="people-bio-links">',
      '#suffix' => '</div>',
    ];



    // -> Publications LINK
    $render_array['ajax_link']['link']['publications'] = [
      '#type' => 'link',
      '#title' => $this->t('Publications'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax']],
      // The URL for this link element is the callback. In our case, it's route
      // ajax_example.ajax_link_callback, which maps to ajaxLinkCallback()
      // below. The route has a /{nojs} section, which is how the callback can
      // know whether the request was made by AJAX or some other means where
      // JavaScript won't be able to handle the result. If the {nojs} part of
      // the path is replaced with 'ajax', then the request was made by AJAX.
      //
      // Path source from: drupal debug:router | grep 'publications'
      // @todo No idea where the above came from... the route is actually the
      // callback in "people.routing.yml"
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'publications',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="people-bio-links">',
      '#suffix' => '</div>',
    ];

    // -> Contact link
    $render_array['ajax_link']['link']['contact'] = [
      '#type' => 'link',
      '#title' => $this->t('Contact'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax']],
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'contact',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="people-bio-links">',
      '#suffix' => '</div>',
    ];



    /**
     * Dev: Temporary Footer
     * @todo Remove before production
     */
    $render_array['dev_footer'] = [
      '#type' => 'markup',
      '#markup' => $this->t('footer'),
      '#prefix' => '<div><h2>',
      '#suffix' => '</h2></div>',
    ];

    return $render_array;
  }

  /**
   * This function pulls the user bio from the user profile object
   * @param $uid
   *
   * @return mixed
   */
  protected function people_bio($uid) {
    // Load profile
    $userProfile = \Drupal\user\Entity\User::load($uid);
    // Get field data from that user.
    $bio = $userProfile->get('field_user_bio')->value;
    return $bio;
  }

  /**
   * This function loads the a view containing the publications filtered by user
   * @param $uid
   *
   * @return mixed
   */
  private function people_publications($uid) {

    //  http://d8/admin/structure/views/view/publications_listings
    //  Set view arguments
    $view_name = 'publications_listings';
    $display_id = 'publications_uid';

    // Load view object
    $view = \Drupal\views\Views::getView($view_name);
    $view->setDisplay($display_id);
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    return $variables;
  }


  /**
   * @param $uid
   *
   * @return mixed|null
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  private function people_contact($uid) {

    $block_id = 'searchform';
    $entity_type = 'block';
    $view_builder = \Drupal::entityTypeManager()->getViewBuilder($entity_type);
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);
    $node = $storage->load($block_id);
    $build = $view_builder->view($node);
    $variables = render($build);
    
    return $variables;
  }


  /**
   * @param $option
   * @param $uid
   * @param string $nojs
   *
   * @return \Drupal\Core\Ajax\AjaxResponse|\Symfony\Component\HttpFoundation\Response
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function peopleAjaxLinkCallback($option, $uid, $nojs = 'ajax') {
    // Determine whether the request is coming from AJAX or not.
    if ($nojs == 'ajax') {

      //Decide which bio option we are going to load

      switch ($option) {

        case "bio":
          //get the bio here
          //@todo Build out content and remember to add the div with class

          $output = $render_array['profile']['basic_profile_dynamic'] = [
            '#type' => 'markup',
            '#markup' => $this->people_bio($uid),
            '#prefix' => '<div class="people_bio_dynamic"><div class="profile-swap">',
            '#suffix' => '</div></div>',
          ];
          break;

        case "publications";
          //Get publications
          //@todo Build out content and remember to add the div with class
          $output = $this->people_publications($uid);
          break;

        case "contact";
          //Get contact form
          //@todo Build out content and remember to add the div with class
          $output = $render_array['profile']['basic_profile_contact'] = [
            '#type' => 'markup',
            '#markup' => $this->people_contact($uid),
            '#prefix' => '<div class="people_bio_dynamic"><div class="profile-swap">',
            '#suffix' => '</div></div>',
          ];
          break;
        default:
          // Do the default for bad parm
          $output = $this->t('bad parm in ajax string');

      }

      $response = new AjaxResponse();
      $response->addCommand(new ReplaceCommand('.profile-swap', $output));

      return $response;
    }
    // no-ajax response
    $response = new Response($this->t("This is some content delivered via a page load."));
    return $response;
  }

}