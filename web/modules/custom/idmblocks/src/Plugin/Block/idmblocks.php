<?php

namespace Drupal\idmblocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Hello' Block.
 *
 * @Block(
 *   id = "hello_block",
 *   admin_label = @Translation("Hello world!"),
 *   category = @Translation("IDM Custom"),
 * )
 */

class idmblocks extends BlockBase {


  /**
   *  {@inheritdoc}
   */

    public function build() {

      $build = array(
        '#markup' => $this->t('Hello world, again'),
      );

      return $build;
    }

}