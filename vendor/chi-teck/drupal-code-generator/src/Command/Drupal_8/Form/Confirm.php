<?php

namespace DrupalCodeGenerator\Command\Drupal_8\Form;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Implements d8:form:confirm command.
 */
class Confirm extends Base {

  protected $name = 'd8:form:confirm';
  protected $description = 'Generates a confirmation form';
  protected $alias = 'confirm-form';

  /**
   * {@inheritdoc}
   */
  protected function interact(InputInterface $input, OutputInterface $output) {
    $options = [
      'default_class' => 'ExampleConfirmForm',
      'default_permission' => 'administer site configuration',
      'default_path_prefix' => '/admin',
      'template' => 'd8/form/confirm.twig',
    ];
    $this->doInteract($input, $output, $options);
  }

}
