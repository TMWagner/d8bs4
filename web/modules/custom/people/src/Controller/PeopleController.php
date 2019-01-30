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

    $idmuser = \Drupal\user\Entity\User::load($arg1);
    $display_username = $idmuser->getAccountName();

    $current_user = user_load($user_id);

//    $activeProfile = \Drupal::getContainer()
//      ->get('entity_type.manager')
//      ->getStorage('profile')
//      ->loadByUser(User::load([$arg1]), '[profile_machine_name]');
//




//    $testval::values["field_user_first_name"]["x-default"][0]["value"];

    $firstname = $user->field_r_user_first_name->value;

    $arrayFoo = (array) $idmuser;
    $firstname_works = $arrayFoo["\0*\0values"]["field_user_first_name"]["x-default"][0]["value"];



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
      '#markup' => $firstname_works,
      '#prefix' => '<div><h1>',
      '#suffix' => '</h1></div>',
    ];


    return $render_array;
  }



}

