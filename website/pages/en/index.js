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
            <Button href={docUrl('getting-started.html')}>Get started</Button>
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
            content: 'After deploying your app to a Kubernetes cluster, you can scale indefinitely by using the `kubectl scale deployment` command to add more `agc-worker` and `agc-broker` instances as needed.',
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
          <a className="splashSubsectionLink" href={`${docsUrl}/deploying-to-kubernetes`}>
            <div className="splashSubsectionItem">
              <img className="splashLogo splashLogoK8s" src={`${baseUrl}img/k8s-logo.png`} />
              <div className="splashSubsectionCaption">Runs and scales on Kubernetes</div>
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
