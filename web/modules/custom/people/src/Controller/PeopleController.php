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
   * Display the markup (This should not be called in production)
   *
   * @return array
   *   Return markup array.
   *
   * Note: This functions is probably not needed - delete?
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


    $render_array['page'] = [
      '#type' => 'markup',
      '#markup' => 'Profile page',
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
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    //  Build the basic profile display
    $render_array['page_basic'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
    ];
    //  Build the initial bio - This will be replaced
    $render_array['bio']['content'] = [
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div id="people-bio-dynamic">',
      '#suffix' => '</div>',
    ];

    //  Test for alternate bio elements
    //    - Publications
    //    - Video

    //  Build links as needed
    // We build the AJAX link.
    $render_array['ajax_link']['link'] = [
      '#type' => 'link',
      '#title' => $this->t('Click me - bozo'),
      // We have to ensure that Drupal's Ajax system is loaded.
      '#attached' => ['library' => ['core/drupal.ajax']],
      // We add the 'use-ajax' class so that Drupal's AJAX system can spring
      // into action.
      '#attributes' => ['class' => ['use-ajax']],
      // The URL for this link element is the callback. In our case, it's route
      // ajax_example.ajax_link_callback, which maps to ajaxLinkCallback()
      // below. The route has a /{nojs} section, which is how the callback can
      // know whether the request was made by AJAX or some other means where
      // JavaScript won't be able to handle the result. If the {nojs} part of
      // the path is replaced with 'ajax', then the request was made by AJAX.
      //
      // Path comes from:
      // //  **** Got this with drupal debug:router | grep 'publications'
      '#url' => Url::fromRoute('people.profile_ajax_link_callback', [
        'option' => 'bio',
        'uid' => '133',
        'nojs' => 'ajax'
      ]),
    ];





    //  Build \profile\videos\$uid\nojs
    $render_array['footer'] = [
      '#type' => 'markup',
      '#markup' => $this->t('footer'),
      '#prefix' => '<div><h2>',
      '#suffix' => '</h2></div>',
    ];

    //  Build \profile\contact\$uid\nojs

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
    $profile_id = 'publications_listings';
    $display_id = 'publications_uid';

    //**** DEBUG / hardcoding uid to make sure we get publications ****
    $uid = '152';
    // Load view object
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
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
      $output = $this->t("This is some content delivered via AJAX!");
      $response = new AjaxResponse();
      $response->addCommand(new ReplaceCommand('#people-bio-dynamic', $output));
      return $response;
    }
    // no-ajax response
    $response = new Response($this->t("This is some content delivered via a page load."));
    return $response;
  }





}