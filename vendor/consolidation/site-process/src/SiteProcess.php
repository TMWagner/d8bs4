<?php
namespace Consolidation\SiteProcess;

use Consolidation\SiteAlias\AliasRecord;
use Consolidation\SiteProcess\Transport\DockerComposeTransport;
use Consolidation\SiteProcess\Util\ArgumentProcessor;
use Consolidation\SiteProcess\Transport\LocalTransport;
use Consolidation\SiteProcess\Transport\SshTransport;
use Consolidation\SiteProcess\Transport\TransportInterface;
use Consolidation\Config\Util\Interpolator;
use Consolidation\SiteProcess\Util\ShellOperatorInterface;
use Consolidation\SiteProcess\Util\Escape;

/**
 * A wrapper around Symfony Process that uses site aliases
 * (https://github.com/consolidation/site-alias)
 *
 * - Interpolate arguments using values from the alias
 *   e.g. `$process = new SiteProcess($alias, ['git', '-C', '{{root}}']);`
 * - Make remote calls via ssh as if they were local.
 */
class SiteProcess extends ProcessBase
{
    /** @var AliasRecord */
    protected $siteAlias;
    /** @var string[] */
    protected $args;
    /** @var string[] */
    protected $options;
    /** @var string[] */
    protected $optionsPassedAsArgs;
    /** @var string */
    protected $cd;
    /** @var TransportInterface */
    protected $transport;

    /**
     * Process arguments and options per the site alias and build the
     * actual command to run.
     */
    public function __construct(AliasRecord $siteAlias, TransportInterface $transport, $args, $options = [], $optionsPassedAsArgs = [])
    {
        $this->siteAlias = $siteAlias;
        $this->transport = $transport;
        $this->args = $args;
        $this->options = $options;
        $this->optionsPassedAsArgs = $optionsPassedAsArgs;

        parent::__construct([]);
    }

    /**
     * @inheritdoc
     */
    public function setWorkingDirectory($cwd)
    {
        $this->cd = $cwd;
        return parent::setWorkingDirectory($cwd);
    }

    public function chdirToSiteRoot($shouldUseSiteRoot = true)
    {
        if (!$shouldUseSiteRoot || !$this->siteAlias->hasRoot()) {
            return $this;
        }

        return $this->setWorkingDirectory($this->siteAlias->root());
    }

    /**
     * Take all of our individual arguments and process them for use.
     */
    protected function processArgs()
    {
        $transport = $this->getTransport($this->siteAlias);
        $transport->configure($this);

        $processor = new ArgumentProcessor();
        $selectedArgs = $processor->selectArgs(
            $this->siteAlias,
            $this->args,
            $this->options,
            $this->optionsPassedAsArgs
        );

        // Ask the transport to drop in a 'cd' if needed.
        if ($this->cd) {
            $selectedArgs = $transport->addChdir($this->cd, $selectedArgs);
        }

        // Do any necessary interpolation on the selected arguments.
        $processedArgs = $this->interpolate($selectedArgs);

        // Wrap the command with 'ssh' or some other transport if this is
        // a remote command; otherwise, leave it as-is.
        return $transport->wrap($processedArgs);
    }

    public function setTransport($transport)
    {
        $this->transport = $transport;
    }

    /**
     * Ask the transport manager for the correct transport for the
     * provided alias.
     */
    protected function getTransport(AliasRecord $siteAlias)
    {
        return $this->transport;
    }

    /**
     * @inheritDoc
     */
    public function getCommandLine()
    {
        $commandLine = parent::getCommandLine();
        if (empty($commandLine)) {
            $processedArgs = $this->processArgs();
            $commandLine = Escape::argsForSite($this->siteAlias, $processedArgs);
            $commandLine = implode(' ', $commandLine);
            $this->setCommandLine($commandLine);
        }
        return $commandLine;
    }

    /**
     * @inheritDoc
     */
    public function start(callable $callback = null, $env = array())
    {
        $cmd = $this->getCommandLine();
        parent::start($callback, $env);
    }

    /**
     * @inheritDoc
     */
    public function wait(callable $callback = null)
    {
        $return = parent::wait($callback);
        return $return;
    }

    /**
     * interpolate examines each of the arguments in the provided argument list
     * and replaces any token found therein with the value for that key as
     * pulled from the given site alias.
     *
     * Example: "git -C {{root}} status"
     *
     * The token "{{root}}" will be converted to a value via $siteAlias->get('root').
     * The result will replace the token.
     *
     * It is possible to use dot notation in the keys to access nested elements
     * within the site alias record.
     *
     * @param AliasRecord $siteAlias
     * @param type $args
     * @return type
     */
    protected function interpolate($args)
    {
        $interpolator = new Interpolator();
        return array_map(
            function ($arg) use ($interpolator) {
                if ($arg instanceof ShellOperatorInterface) {
                    return $arg;
                }
                return $interpolator->interpolate($this->siteAlias, $arg, false);
            },
            $args
        );
    }
}
