var CcardRightCimotion = React.createClass({
  displayName: 'CcardRightCimotion',

  render: function () {
    var post = this.props.post;
    var reaction_most = 'https://beta.ciayo.com/assets/svg/notif-cimotion-ciayo.svg';
    function cimotionMouseEnter(e) {
      var el = angular.element(e.target);
      el.addClass('-roll');
      el.off('animationiteration webkitAnimationIteration', move);
    }
    function cimotionMouseLeave(e) {
      var el = angular.element(e.target);
      el.on('animationiteration webkitAnimationIteration', move);
    }
    function move() {
      angular.element(this).removeClass("-roll");
    }
    return React.createElement(
      'div',
      { className: 'layout-row flex-none card-tab -head' },
      React.createElement(
        'div',
        { className: 'layout-row flex card-react' },
        React.createElement(
          'div',
          { className: '_topmost flex-none' },
          React.createElement('img', { src: 'https://beta.ciayo.com/assets/img/reaction/Wow-color.png' })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/hand.svg")' }, className: ' flex-none _reaction -s40', title: 'CIAYO', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/chips.svg")' }, className: ' flex-none _reaction -s40', title: 'WOW', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/crocket.svg")' }, className: ' flex-none _reaction -s40', title: 'HAPPY', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/coco.svg")' }, className: ' flex-none _reaction -s40', title: 'LOVE', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/carla.svg")' }, className: ' flex-none _reaction -s40', title: 'ANGRY', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        ),
        React.createElement(
          'div',
          { className: 'flex-noshrink layout-row layout-align-center-center _reaction_item' },
          React.createElement('div', { 'md-ink-ripple': '#000000', style: { 'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/chuck.svg")' }, className: ' flex-none _reaction -s40', title: 'SAD', onMouseEnter: cimotionMouseEnter, onMouseLeave: cimotionMouseLeave })
        )
      ),
      React.createElement(
        'div',
        { className: 'layout-align-center-center layout-row card-tab-toggle' },
        React.createElement(
          'span',
          { className: 'flex' },
          React.createElement(
            'span',
            null,
            post.reaction.detail.count
          ),
          ' People give reaction  '
        )
      )
    );
  }
});
var CcardRightComment = React.createClass({
  displayName: 'CcardRightComment',

  render: function () {
    return React.createElement(
      'div',
      { className: 'flex-none card-tab' },
      React.createElement(
        'div',
        { className: 'layout-column layout-align-center-center card-tab-toggle' },
        React.createElement('i', { className: 'ci-comment s-20' }),
        React.createElement(
          'span',
          null,
          '1'
        )
      ),
      React.createElement(
        'div',
        { className: 'layout-row card-pane' },
        React.createElement(
          'div',
          { className: 'layout-column flex card-comment-block' },
          React.createElement(
            'div',
            { 'class': 'flex-none card-comment-more' },
            React.createElement(
              'span',
              null,
              'View more comment...'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex-none card-comment-more' },
            React.createElement(
              'span',
              null,
              'Load more comment...'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex-grow card-comments' },
            React.createElement(
              'div',
              { className: '_empty-comment' },
              React.createElement(
                'span',
                null,
                'No comment on this post!'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'flex-none layout-row card-comment-box' },
            React.createElement(
              'div',
              { className: 'flex-initial _userimage' },
              React.createElement('div', { className: 'c-pp -s30' })
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'layout-column card-comment-nested' },
          React.createElement('div', { className: 'flex-none card-comment-back' })
        )
      )
    );
  }
});
var CcardRightShare = React.createClass({
  displayName: 'CcardRightShare',

  render: function () {
    return React.createElement(
      'div',
      { className: 'flex-none card-tab' },
      React.createElement(
        'div',
        { className: 'layout-column layout-align-center-center card-tab-toggle' },
        React.createElement('i', { className: 'ci-share s-20' }),
        React.createElement(
          'span',
          null,
          '234'
        )
      ),
      React.createElement(
        'div',
        { className: 'layout-column card-pane' },
        React.createElement(
          'div',
          { className: 'flex-none layout-row card-share-activity' },
          React.createElement(
            'div',
            { className: 'flex' },
            'Share your activity'
          ),
          React.createElement(
            'a',
            { href: '#', className: '_media _instagram' },
            React.createElement('i', { className: 'ci-instagram s-24' })
          ),
          React.createElement(
            'a',
            { href: '#', className: '_media _twitter' },
            React.createElement('i', { className: 'ci-twitter s-24' })
          ),
          React.createElement(
            'a',
            { href: '#', className: '_media _facebook' },
            React.createElement('i', { className: 'ci-facebook s-24' })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex' },
          React.createElement(
            'div',
            { className: '_empty-share' },
            React.createElement(
              'span',
              null,
              ' No body share this post'
            )
          )
        )
      )
    );
  }
});
var CcardRightDownload = React.createClass({
  displayName: 'CcardRightDownload',

  render: function () {
    return React.createElement(
      'div',
      { className: 'flex-none card-tab' },
      React.createElement(
        'div',
        { className: 'layout-column layout-align-center-center card-tab-toggle' },
        React.createElement('i', { className: 'ci-download s-20' })
      )
    );
  }
});
var CcardRightCButton = React.createClass({
  displayName: 'CcardRightCButton',

  render: function () {
    return React.createElement(
      'div',
      { className: 'flex-none card-tab' },
      React.createElement(
        'div',
        { className: 'layout-column layout-align-center-center card-tab-toggle' },
        React.createElement('i', { className: 'ci-c-button s-20' })
      )
    );
  }
});
var CcardRightSetting = React.createClass({
  displayName: 'CcardRightSetting',

  render: function () {
    return React.createElement(
      'div',
      { className: 'flex-none card-tab' },
      React.createElement(
        'div',
        { className: 'layout-column layout-align-center-center card-tab-toggle' },
        React.createElement('i', { className: 'ci-etc-outline s-20' })
      ),
      React.createElement(
        'div',
        { className: 'layout-column card-pane' },
        React.createElement(
          'div',
          { className: 'flex layout-row card-option' },
          React.createElement(
            'div',
            { className: 'flex layout-column layout-align-center-center card-option-button' },
            React.createElement(
              'div',
              { className: 'flex-none _option' },
              React.createElement(
                'div',
                { className: '_button' },
                'Post Permission'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex-none _option' },
              React.createElement(
                'div',
                { className: '_button' },
                'Report Post'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex-none _option' },
              React.createElement(
                'div',
                { className: '_button' },
                'Turn Off Notification'
              )
            ),
            React.createElement(
              'div',
              { className: 'flex-none _option' },
              React.createElement(
                'div',
                { className: '_button' },
                'Edit Post'
              ),
              React.createElement(
                'div',
                { className: '_dropdown' },
                React.createElement(
                  'div',
                  { className: '_button' },
                  'Caption'
                ),
                React.createElement(
                  'div',
                  { className: '_button' },
                  'With'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'flex-none _option' },
              React.createElement(
                'div',
                { className: '_button' },
                'Delete Pot'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'layout-column -permission card-option-pane' },
            React.createElement(
              'div',
              { className: 'flex-none _head' },
              React.createElement('div', { 'class': '_button -back' })
            )
          )
        )
      )
    );
  }
});
var CcardRight = React.createClass({
  displayName: 'CcardRight',

  render: function () {
    var post = this.props.post;
    return React.createElement(
      'div',
      { className: 'layout-column flex-50 card-right' },
      React.createElement(CcardRightCimotion, { post: post }),
      React.createElement(CcardRightComment, { post: post }),
      React.createElement(CcardRightShare, { post: post }),
      React.createElement(CcardRightDownload, { post: post }),
      React.createElement(CcardRightSetting, { post: post }),
      React.createElement(CcardRightCButton, { post: post }),
      React.createElement('div', { className: 'card-tab-active' })
    );
  }
});
//# sourceMappingURL=card-right-component.js.map
