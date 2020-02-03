/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        <img className="titleLogo" src="img/socketcluster-logo-blue.png" />
        {siteConfig.title} <a
          className="github-button"
          href="https://github.com/SocketCluster/socketcluster"
          data-icon="octicon-star"
          data-count-href="https://github.com/SocketCluster/socketcluster/stargazers"
          data-show-count="true"
          data-count-aria-label="# stargazers on GitHub"
          data-size="large"
          data-text="Star"
          aria-label="Star this project on GitHub">
        </a>
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('getting-started')}>Get started</Button>
            <Button
              href="https://github.com/SocketCluster/socketcluster"
              target="_blank"
              rel="noreferrer noopener"
            >Browse GitHub</Button>
            <Button
              href="https://gitter.im/SocketCluster/socketcluster"
              target="_blank"
              rel="noreferrer noopener"
            >Chat on Gitter</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const BlockWithHeading = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <h1 className="blockHeading" align="center">{props.heading}</h1>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'Pub/sub channels are very cheap. You can have millions of unique channels without worrying about memory or CPU usage. Channels are automatically cleaned up when they are no longer used.',
            image: `${baseUrl}img/icons/unlimited-channels.png`,
            imageAlign: 'top',
            title: 'Handle unlimited channels',
          },
          {
            content: 'The `socketcluster` CLI tool exposes `kubectl` (Kubernetes) shortcut commands to make deploying your app to any Kubernetes cluster really easy. All necessary Kubernetes `.yaml` files are provided.',
            image: `${baseUrl}img/icons/deploy-containers.png`,
            imageAlign: 'top',
            title: 'Deploy easily',
          },
          {
            content: 'After deploying your app to a Kubernetes cluster, you can scale indefinitely by using the `kubectl scale deployment` command to add more `scc-worker` and `scc-broker` instances as needed.',
            image: `${baseUrl}img/icons/scale.png`,
            imageAlign: 'top',
            title: 'Scale easily',
          },
          {
            content: 'You can perform asynchronous operations anywhere along a socket\'s inbound or outbound stream without any risk of disrupting the message processing order.',
            image: `${baseUrl}img/icons/delivery-order.png`,
            imageAlign: 'top',
            title: 'Guarantee message order',
          },
          {
            content: 'Awaiting for asynchronous actions along a socket\'s inbound or outbout streams can cause messages to pile up. This can be easily monitored on the back end using `socket.getInboundBackpressure()` and `socket.getOutboundBackpressure()`.',
            image: `${baseUrl}img/icons/pressure.png`,
            imageAlign: 'top',
            title: 'Monitor message backpressure',
          },
          {
            content: 'SocketCluster supports JWT authentication. This form of authentication is ideal for WebSockets because the token expiry can be made arbitrarily short and renewed often on an interval for very little performance cost while saving many database lookups.',
            image: `${baseUrl}img/icons/authentication.png`,
            imageAlign: 'top',
            title: 'Support efficient authentication',
          },
          {
            content: 'Middleware streams allow you to block socket connections using the `MIDDLEWARE_HANDSHAKE` middleware line and to block individual socket actions using the `MIDDLEWARE_INBOUND` and `MIDDLEWARE_OUTBOUND` lines.',
            image: `${baseUrl}img/icons/police-access-control.png`,
            imageAlign: 'top',
            title: 'Enforce access control using middleware streams',
          },
          {
            content: 'Every data packet which is being received from or being sent to a client can be delayed or transformed using `MIDDLEWARE_INBOUND_RAW`, `MIDDLEWARE_INBOUND` or `MIDDLEWARE_OUTBOUND` lines.',
            image: `${baseUrl}img/icons/breaks-throttle.png`,
            imageAlign: 'top',
            title: 'Throttle and transform data using middleware streams',
          },
          {
            content: 'All data and events must be consumed using asynchronous loops (e.g. `for-await-of`). Event listener callbacks are not supported; this solves many problems related to code readability and maintainability.',
            image: `${baseUrl}img/icons/tangled-hell.png`,
            imageAlign: 'top',
            title: 'Avoid callback hell',
          },
          {
            content: 'Clients are optimized to handle lost connections seamlessly. For example, if a client loses the connection, channels attached to that socket will be put in a `pending` state and automatically resubscribe after the socket reconnects .',
            image: `${baseUrl}img/icons/recover.png`,
            imageAlign: 'top',
            title: 'Recover from failure',
          },
          {
            content: 'Without callbacks, asynchronous logic can always be executed from top to bottom. This makes it more obvious which parts of the code are serial and which parts are parallel and it encourages a more declarative style of programming.',
            image: `${baseUrl}img/icons/declare-king.png`,
            imageAlign: 'top',
            title: 'Write declarative code',
          },
          {
            content: 'Sockets and channels do not need to be destroyed explicitly. They will be automatically marked for garbage collection as soon as they stop being used and are no longer referenced in the code.',
            image: `${baseUrl}img/icons/mem-leak-color.png`,
            imageAlign: 'top',
            title: 'Avoid memory leaks',
          },
        ]}
      </Block>
    );

    // const Showcase = () => {
    //   const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    //   const langPart = `${language ? `${language}/` : ''}`;
    //   const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    //
    //   return (
    //     <div className="productShowcaseSection paddingBottom">
    //       <a href={docUrl('deploying-to-kubernetes.html')}>
    //         <img style={{width: '500px', marginTop: '100px'}} src={`${baseUrl}img/kubernetes-horizontal.png`} />
    //       </a>
    //     </div>
    //   );
    // };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="splashSubsection">
        <div className="splashSubsectionCaption" style={{marginRight: '15px'}}>Sponsored by</div>
          <a className="splashSubsectionLink" href={`https://coinigy.com`} target="_blank">
            <div className="splashSubsectionItem">
              <img className="splashLogo" style={{width: '180px', paddingBottom: '10px'}} src="data:img/png;base64,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" />
            </div>
          </a>
        </div>
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
