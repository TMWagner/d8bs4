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
   * Display the markup.
   *
   * @return array
   *   Return markup array.
   */
  public function content() {

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

  public function arguments($arg1) {
//    // Load profile
//    $userProfile = \Drupal\user\Entity\User::load($arg1);

    // Set view arguments
    $profile_id = 'profile_basic_content';
    $display_id = 'user_profile_desktop';


    // Load view object
    $view = \Drupal\views\Views::getView($profile_id);
    $view->setDisplay('user_profile_desktop');
    $view->setArguments(array($arg1));
    $view->execute();
    $variables['content'] = $view->buildRenderable($display_id);





    $render_array['page_test'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
    ];

//    $render_array['page_example_arguments_firstname'] = [
//      '#type' => 'markup',
//      '#markup' => $firstname . ' ' . $lastname,
//      '#prefix' => '<div><h1>',
//      '#suffix' => '</h1></div>',
//    ];

    //Got this with drupal debug:router | grep 'publications'
    $url = Url::fromRoute('view.publications_listings.publications_listing');
    $render_array['page_link_test'] = [
      '#title' => $this->t('Publications'),
      '#type' => 'link',
      '#url' => $url,
      '#attributes' => array('class' => array('use-ajax', 'profile-button-bio')),
    ];


    return $render_array;
    //This strips out all the Drupal ish stuff and spits out only HTML
//    return new Response(render($render_array));
  }
}