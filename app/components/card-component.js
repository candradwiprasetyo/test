var cardComponent = React.createClass({
  displayName: 'cardComponent',

  getInitialState: function () {
    return {
      time: '12:00'
    };
  },
  render: function () {
    var props = this.props;
    var state = this.state;
    var Card = function () {
      var _return = React.createElement('div', null);
      if (props.post) {
        _return = props.post.map(function (post) {
          var date = '2016-01-01',
              profile_style = {
            backgroundColor: post.user_avatar.full_body.background_avatar,
            backgroundImage: 'url(' + post.user_avatar.full_body.avatar + ')'
          },
              profile_link = '#/profile/' + post.username,
              caption_hide = !post.activity_detail.caption_bubble && post.activity_detail.caption != '' && post.activity_detail.caption != null;
          ;
          return React.createElement(
            'div',
            { className: 'c-tml-row' },
            React.createElement(
              'div',
              { className: 'c-tml-head layout-row' },
              React.createElement(
                'div',
                { className: 'c-tml-datetime flex-none' },
                React.createElement(
                  'div',
                  { className: '_time' },
                  state.time
                ),
                React.createElement(
                  'div',
                  { className: '_date' },
                  date
                )
              ),
              React.createElement(
                'div',
                { className: 'c-tml-userimage flex-none' },
                React.createElement('div', { className: 'c-pp -s40', style: profile_style })
              ),
              React.createElement(
                'div',
                { className: 'c-tml-username flex-none' },
                React.createElement(
                  'a',
                  { href: profile_link },
                  post.user_display_name
                )
              ),
              React.createElement(
                'div',
                { className: 'c-tml-status' },
                post.activity_detail.activity_title
              )
            ),
            React.createElement(
              'div',
              { className: 'layout-row card' },
              React.createElement(
                'div',
                { className: 'layout-column flex-50 card-activity' },
                React.createElement(
                  'div',
                  { className: 'flex-none card-activity-parallax' },
                  React.createElement(
                    'div',
                    { className: 'parallax' },
                    React.createElement(CcardParallax, { activity_detail: post.activity_detail })
                  ),
                  React.createElement(
                    'div',
                    { className: 'card-activity-caption' },
                    post.activity_detail.caption
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'layout-wrap layout-row' },
                  React.createElement(
                    'div',
                    { className: '-item ng-scope flex-nogrow card-activity-info' },
                    React.createElement(
                      'div',
                      { className: 'layout-column layout-align-center-center card-activity-toggle' },
                      React.createElement('i', { className: 'ci-item-blank s-20' }),
                      React.createElement(
                        'span',
                        null,
                        'No Item'
                      )
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: '-item ng-scope flex-nogrow card-activity-info' },
                    React.createElement(
                      'div',
                      { className: 'layout-column layout-align-center-center card-activity-toggle' },
                      React.createElement('i', { className: 'ci-item-blank s-20' }),
                      React.createElement(
                        'span',
                        null,
                        'Item 1'
                      )
                    )
                  )
                )
              ),
              React.createElement(CcardRight, { post: post })
            )
          );
        });
      }
      return _return;
    };
    return React.createElement(
      'div',
      null,
      Card()
    );
  }
});
//# sourceMappingURL=card-component.js.map
