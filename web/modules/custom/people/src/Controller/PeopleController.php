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

    $render_array['page'] = [
      '#type' => 'markup',
      '#markup' => 'Profile page',
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];
    return $render_array;
  }

  public function arguments($arg1) {
    // Load profile
    $userProfile = \Drupal\user\Entity\User::load($arg1);

    // Get field data from that user.
    $firstname = $userProfile->get('field_user_first_name')->value;
    $lastname = $userProfile->get('field_user_last_name')->value;
    $title = $userProfile->get('field_user_title')->value;
    $userpicture = $userProfile->get('user_picture')->value;
    $videolink = $userProfile->get('field_user_video_link')->value;


    // Staff snippet.

    $view = \Drupal\views\Views::getView('profile_basic_content');
    $view->setDisplay('user_profile_desktop');
//    $view->preExecute();
    $view->setArguments(array($arg1));
    $view->execute();

    $variables['content'] = $view->buildRenderable('user_profile_desktop');


    $list[] = $this->t("First number was @number.", ['@number' => $arg1]);

    $render_array['page_example_arguments'] = [
      // The theme function to apply to the #items.
      '#theme' => 'item_list',
      // The list itself.
      '#items' => $list,
      '#title' => $this->t('Argument Information'),
    ];

    $render_array['page_test'] = [
      '#theme' => 'people_profile',
      '#content' => $variables,
    ];

    $render_array['page_example_arguments_firstname'] = [
      '#type' => 'markup',
      '#markup' => $firstname . ' ' . $lastname,
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];

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