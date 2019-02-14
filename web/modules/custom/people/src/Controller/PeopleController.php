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
     * @todo Remove before production.
     */

    $block_id = 'bootstrap_sass_powered';
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
    // Need gracefull recovery if View doesn't exist
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    //  Build the basic profile display
    $render_array['basic_profile'] = array (
      '#type' => 'container',
//      '#attributes' => array(
//        'class' => 'accommodation',
//      ),
      '#prefix' => '<div class="profile-bio-link-wrap not-mobile-display">',
      '#suffix' => '</div>',

    );

    $render_array['basic_profile']['basic_profile_static'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
      '#prefix' => '<div class="profile_bio_static">',
      '#suffix' => '</div>',
    ];
    //  Build the initial bio - This will be replaced
    $render_array['basic_profile']['basic_profile_dynamic'] = [
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div class="people_bio_dynamic"><div class="profile-swap">',
      '#suffix' => '</div></div>',
    ];

    //  Test for alternate bio elements
    //    - Publications
    //    - Video

    // Publications test
    $name = 'publications_listings';
    $display_id = 'publications_uid';

    //  Test one
    $publications = TRUE;
    $test_for_publications = views_get_view_result($name, $display_id, $uid);
    if (empty($test_for_publications)) {
      $publications = FALSE;
    }
    //  Test two  (this will return null if no publications
    $result = $this->people_publications($uid);


    /**
     * Build conditional AJAX links as needed
     */

    //Check for Publications

    // Make this a service?  and pass single parameter?
    $render_array['ajax_link']['link'] = [
      '#type' => 'link',
      '#title' => $this->t('Click me to load the publications'),
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
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'publications',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="people-bio-links">',
      '#suffix' => '</div>',
    ];



    /**
     * Dev: Temporary Footer
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
   * Callback for link example.
   *
   * Takes different logic paths based on whether Javascript was enabled.
   * If $type == 'ajax', it tells this function that ajax.js has rewritten
   * the URL and thus we are doing an AJAX and can return an array of commands.
   *
   * @param string $nojs
   *   Either 'ajax' or 'nojs. Type is simply the normal URL argument to this
   *   URL.
   *
   * @return string|array
   *   If $type == 'ajax', returns an array of AJAX Commands.
   *   Otherwise, just returns the content, which will end up being a page.
   */
  public function peopleAjaxLinkCallback($option, $uid, $nojs = 'ajax') {
    // Determine whether the request is coming from AJAX or not.
    if ($nojs == 'ajax') {

      //Decide which bio option we are going to load

      $output = $this->people_publications($uid);

      
      $response = new AjaxResponse();
      $response->addCommand(new ReplaceCommand('.profile-swap', $output));

      return $response;
    }
    // no-ajax response
    $response = new Response($this->t("This is some content delivered via a page load."));
    return $response;
  }

}