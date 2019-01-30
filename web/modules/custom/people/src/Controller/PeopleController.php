<?php
/**
 * Created by PhpStorm.
 * User: thomaswagner
 * Date: 2019-01-27
 * Time: 10:10
 *
 * Render properties:
 * https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Render%21Element%21RenderElement.php/class/RenderElement/8.6.x
 */

namespace Drupal\people\Controller;

use Drupal\Core\Controller\ControllerBase;


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

    $current_user = \Drupal::currentUser();

    $current_user_name = $current_user->getDisplayName();

    return [
      '#type' => 'markup',
      '#markup' => $this->t($current_user_name),
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];
  }

  public function arguments($arg1) {

    // Load the user profile
    $userProfile = \Drupal\user\Entity\User::load($arg1);


    //Get the values
    $lastname = $userProfile->values["field_user_last_name"]["x-default"][0]["value"];  // Just comes up NULL


    // Get field data from that user.
    $lastname = $userProfile->get('field_user_last_name')->value;




    $list[] = $this->t("First number was @number.", ['@number' => $arg1]);
//    $list[] = $this->t("Second number was @number.", ['@number' => $arg2]);
//    $list[] = $this->t('The total was @number.', ['@number' => $arg1 + $arg2]);




    $render_array['page_example_arguments'] = [
      // The theme function to apply to the #items.
      '#theme' => 'item_list',
      // The list itself.
      '#items' => $list,
      '#title' => $this->t('Argument Information'),
    ];

    $render_array['page_example_arguments_firstname'] = [
      '#type' => 'markup',
      '#markup' => $lastname,
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];


    return $render_array;
  }



}

