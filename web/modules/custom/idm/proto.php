<?php
/**
 * Created by PhpStorm.
 * User: thomaswagner
 * Date: 2019-01-09
 * Time: 13:26
 */


/**
 * Implements hook_views_pre_render().
 */
function kf_products_views_pre_render(&$view) {
  $products_view = array('products', 'expired_products');
  $results = &$view->result;
  foreach ($results as $key => $result) {
    if ($view->name == 'products') {
      $field_expiry_date = $result->_field_data['nid']['entity']->field_deal_expire;
      $expiry_date = _kf_products_get_remaining_time($field_expiry_date['und'][0]['value']);
      $results[$key]->field_field_deal_expire[0]['rendered']['#markup'] = $expiry_date;
    }
  }
}

function MODULENAME_views_pre_render(\Drupal\views\ViewExecutable $view) {
  if ($view->id() == "view_id" && $view->current_display == 'display_id') {
    $image_style_id = 'my_responsive_image_style';

    $style = ResponsiveImageStyle::load($image_style_id);
    if (!empty($style)) {
      $image_field = $view->field['field_news_image'];
      $image_field->options['type'] = 'responsive_image';
      $image_field->options['settings']['responsive_image_style'] = $image_style_id;
    }
  }
}