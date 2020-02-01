/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language && language !== 'en' ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section style={{textAlign: 'center'}}>
          <a href={this.docUrl('deploying-to-kubernetes', this.props.language)}>
            <div className="footerPromoItem" >
              <img className="footerPromoIcon" src={`${this.props.config.baseUrl}img/k8s-logo.png`} />
              <div className="footerPromoText">Runs and scales on Kubernetes</div>
            </div>
          </a>
        </section>
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Documentation</h5>
            <a href={this.docUrl('getting-started.html', this.props.language)}>
              Getting Started
            </a>
            <a href={this.docUrl('guides.html', this.props.language)}>
              Guides
            </a>
            <a href={this.docUrl('api.html', this.props.language)}>
              API Reference
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://gitter.im/SocketCluster/socketcluster">Project Chat</a>
            <a
              href="https://twitter.com/SocketCluster"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/SocketCluster/socketcluster">GitHub</a>
            <a
              className="github-button"
              href="https://github.com/SocketCluster/socketcluster"
              data-icon="octicon-star"
              data-count-href="https://github.com/SocketCluster/socketcluster/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
