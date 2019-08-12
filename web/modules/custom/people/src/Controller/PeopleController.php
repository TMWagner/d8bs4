<?php
/**
 * Created by PhpStorm.
 * User: thomaswagner
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
    //Test code
    //@todo remove before flight
    $uid = '133';
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';

    $view_output = views_embed_view($profile_id, $display_id, $uid);

    $page['profile']['group1'] = array (
      '#type' => 'markup',
      '#markup' => '<p>div 1</p>',

    );
    $page['profile']['group1']['subgroup'] = array(
      '#type' => 'markup',
      '#markup' => '<p>subgroup?</p>',


    );

    $page['profile']['group2'] = array(
      '#type' => 'markup',
      '#markup' => '<p>div 2</p>',

    );

    $page['profile']['group3'] = array(
      '#type' => 'markup',
      '#markup' => '<p>div 3</p>',
    );

    $page['profile']['bio_mobile'] = array(
      '#type' => 'block',
      'content' => [
        'system_main' => $view_output,
      ],
      '#prefix' => '<div class="mobile-display">',
      '#suffix' => '</div>',
    );

    //Test code
    //@todo remove before flight
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
   * Profile:
   * Builds the profile page for the desktop/tablet modal
   * @param $uid
   *
   * @return mixed
   */
  public function profile($uid) {

    // Set view arguments
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';

    // Load View object
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
      '#prefix' => '<div class="profile-bio-link-wrap not-mobile-display container" id="profile-content">',
      '#suffix' => '</div>',
    );

    $render_array['profile']['profile_static'] = [
      '#type' => 'container',
      '#prefix' => '<div class="profile-bio-wrap col-4">',
      '#suffix' => '</div>',
    ];

    $render_array['profile']['profile_static']['bio'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
      '#prefix' => '<div class="profile_bio_static bio">',
      '#suffix' => '</div>',
    ];


    $render_array['profile']['profile_static']['contact_link'] = [
      '#type' => 'link',
      '#title' => $this->t(''),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax fa fa-envelope']],
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'contact',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="profile_bio_static link">',
      '#suffix' => '</div>',
    ];

    //END contact link

    //  Build dynamic wrapper
    $render_array['profile']['profile_dynamic'] = [
      '#type' => 'container',
      '#prefix' => '<div class="people_bio_dynamic col-8">',
      '#suffix' => '</div>',
    ];

    //  Build the initial bio - This will be replaced
    $render_array['profile']['profile_dynamic']['swap_content'] = [
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div class="profile-swap initial">',
      '#suffix' => '</div>',
    ];

    // Publications test
    $name = 'publications_listings';
    $display_id = 'publications_uid';
    $publications  = TRUE;
    $test_for_publications = views_get_view_result($name, $display_id, $uid);
    if (empty($test_for_publications)) {
      // Build publications link here...
      //@todo We don't need the publications var: just do it or not.
      $publications = FALSE;
    }


    //  Build link set
    //  @todo Move below logic
    $render_array['profile']['profile_dynamic']['link_wrap'] = [
      '#type' => 'container',
      // @todo just a note: Normally would have to add class of "row",
      // but it is coming from the theme instead. That is a little funky...
      '#prefix' => '<div class="profile-dynamic-wrap-links">',
      '#suffix' => '</div>',
    ];

    // *** Bio Link
    $render_array['profile']['profile_dynamic']['link_wrap']['link1'] = [
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
      '#prefix' => '<div class="col col-2 p-1 mx-1 profile-link-item">',
      '#suffix' => '</div>',
    ];

    // *** CONDITIONAL Publications link
    if ($publications) {
      $render_array['profile']['profile_dynamic']['link_wrap']['link2'] = [
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
        '#prefix' => '<div class="col col-2 p-1 mx-1 profile-link-item">',
        '#suffix' => '</div>',
      ];
    }
    // *** CONDITIONAL Projects
    // @todo Conditional Projects
    // End Video

    // *** Contact link
    $render_array['profile']['profile_dynamic']['link_wrap']['projects'] = [
      '#type' => 'link',
      '#title' => $this->t('Projects'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax']],
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'contact',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="col col-2 p-1 mx-1 profile-link-item">',
      '#suffix' => '</div>',
    ];

    // *** CONDITIONAL Videos
    // @todo Conditional Projects
    $render_array['profile']['profile_dynamic']['link_wrap']['videos'] = [
      '#type' => 'link',
      '#title' => $this->t('Videos'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax', 'people/profile']],
      '#attributes' => ['class' => ['use-ajax']],
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'contact',
        'uid' => $uid,
        'nojs' => 'ajax'
      ]),
      '#prefix' => '<div class="col col-2 p-1 mx-1 profile-link-item">',
      '#suffix' => '</div>',
    ];

    return $render_array;
  }

  /**
   * @param $uid
   *
   * @return array
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function profileMobile($uid) {

    $output = array();

    // Set view arguments
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';

    // @todo https://api.drupal.org/api/drupal/core%21modules%21views%21src%21Element%21View.php/class/View/8.7.x
    // Load View object
    // Need graceful recovery if View doesn't exist
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    //  Build the basic profile display
    //  @todo TWIG Task: Added "Row" to sibling DIV with "container.html.twig"
    //  @todo This is the outer wrap from the whole page

    $output['profile'] = array (
      '#type' => 'container',
      '#prefix' => '<div class="profile-bio-link-wrap">',
      '#suffix' => '</div>',
    );

    //Build out the picture/title
    $output['profile']['profile_static'] = [
      '#theme' => 'people_profile_mobile',
      '#content' => $variables,
      '#prefix' => '<div class="profile-mobile-content">',
      '#suffix' => '</div>',
    ];

    //@todo wasted div?  I think we can get rid of this and save a layer on the array?
    // Eh - maybe not... we need an overall accordion wrapper
    // Build wrapper for accordion group
    $output['profile']['dynamic'] = array (
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'profile-accordion container-fluid',
        ],
        //@todo Trigger for accordion
        'id' => 'profile-accordion',
      ],
    );



    $output['profile']['dynamic']['bio']['header'] = array (
      '#type' => 'markup',
      '#markup' => '<h3>Biography</h3>',
    );
    //@todo we may need to make this a container div
    $output['profile']['dynamic']['bio']['content'] = array (
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div id="profile-bio">',
      '#suffix' => '</div>',
    );

    /*
     * ITEM (Publications)
     * (Conditional)
     */
    //Accordion Group Items (BIO Group)
    $output['profile']['dynamic']['pubs']['header'] = array (
      '#type' => 'markup',
      '#markup' => '<h3>Publications</h3>',
    );
    $output['profile']['dynamic']['pubs']['content'] = array (
      '#type' => 'markup',
      '#markup' => '<p>Publications Content</p>',
      '#prefix' => '<div>',
      '#suffix' => '</div>',
    );

    /*
     * ITEM (Projects)
     * (Conditional)
     */
    //Accordion Group Items (BIO Group)
    $output['profile']['dynamic']['proj']['header'] = array (
      '#type' => 'markup',
      '#markup' => '<h3>Projects</h3>',
    );
    $output['profile']['dynamic']['proj']['content'] = array (
      '#type' => 'markup',
      '#markup' => '<p>Projects content</p>',
      '#prefix' => '<div>',
      '#suffix' => '</div>',
    );

    /*
     * Contact Pane
     */
    $output['profile']['dynamic']['contact']['header'] = array (
      '#type' => 'markup',
      '#markup' => '<h3>Contact</h3>',
    );
    $output['profile']['dynamic']['contact']['content'] = array (
      '#type' => 'markup',
      '#markup' => $this->people_contact($uid),
      '#prefix' => '<div class="people_bio_dynamic profile-contact"><div class="profile-swap profile-swap-contact profile-accordion">',
      '#suffix' => '</div></div>',
    );



    /*
     * Close Button
     */
    //Accordion Group Items (BIO Group)
    $output['profile']['close'] = array (
      '#type' => 'markup',
      '#markup' => 'Close Profile',
      '#prefix' => '<div class="profile-button-wrap"> 
                    <a class="profile btn btn-primary">',
      '#suffix' => '</a></div>',
    );
    return $output;
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

    $block_id = 'webform';
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
            '#prefix' => '<div class="people_bio_dynamic"><div class="profile-swap profile-swap-bio">',
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
            '#prefix' => '<div class="people_bio_dynamic profile-contact"><div class="profile-swap profile-swap-contact">',
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
