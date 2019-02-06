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

//use \Symfony\Component\HttpFoundation\Response;


/**
 * Defines HelloController class.
 */
class PeopleController extends ControllerBase {


  /**
   * Display the markup (This should not be called in production)
   *
   * @return array
   *   Return markup array.
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


    $render_array['page_basic'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
    ];

    $render_array['people']['bio'] = [
      '#type' => 'markup',
      '#markup' => $this->people_bio($uid),
      '#prefix' => '<div>',
      '#suffix' => '</div>',
    ];


    //  Test Code (working): Renders profile filtered with $uid
//    $render_array['profile']['basic'] = [
//      '#theme' => 'people_profile',
//      '#content' => $this->people_publications($uid),
//    ];

    //  Test Code
    //  **** Got this with drupal debug:router | grep 'publications'
    //  *** https://drupal.stackexchange.com/questions/144992/how-do-i-create-a-link
//    $url = Url::fromRoute('view.publications_listings.publications_listing');

    $url = Url::fromUri('internal:/profile/publications/' . $uid . '/nojs');

    $render_array['people']['bio'] = [
      '#title' => $this->t('Publications link'),
      '#type' => 'link',
      '#url' => $url,
      '#attributes' => array('class' => array('use-ajax', 'profile-button-bio')),
    ];


    //  Build \profile\bio\$uid\nojs

    //  Build \profile\publications\$uid\nojs
    $render_array['profile']['links']['publications'] = [
      '#title' => $this->t('Publications'),
      '#type' => 'link',
//
      '#url' => 'profile/publications/' . $uid . '/nojs',
      '#attributes' => array('class' => array('use-ajax', 'profile-button-bio')),
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
   * @param $uid
   *
   * @return mixed
   */
  private function people_publications($uid) {

    //  http://d8/admin/structure/views/view/publications_listings
    //  Set view arguments
    $profile_id = 'publications_listings';
    $display_id = 'publications_uid';

    $uid = '152';
    // Load view object
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($uid));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);

    return $variables;

  }

}