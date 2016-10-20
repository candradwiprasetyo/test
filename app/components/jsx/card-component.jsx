var cardComponent = React.createClass({
  getInitialState: function() {
    return {
      time:'12:00'
    }
  },
  render: 
  function() {
    var props = (this.props);
    var state = (this.state);
    var Card = function(){ 
      var _return  = <div></div>;
      if(props.post){
        _return = props.post.map(function(post){
          var 
              date = '2016-01-01',
              profile_style = {
                backgroundColor: post.user_avatar.full_body.background_avatar,
                backgroundImage: 'url('+post.user_avatar.full_body.avatar+')'
              },
              profile_link = '#/profile/'+post.username,
              caption_hide=!post.activity_detail.caption_bubble && (post.activity_detail.caption!=''&& post.activity_detail.caption!=null);
          ;
          return (
            <div className="c-tml-row">
              <div className="c-tml-head layout-row">
                <div className="c-tml-datetime flex-none">
                  <div className="_time">{state.time}</div>
                  <div className="_date">{date}</div>
                </div>
                <div className="c-tml-userimage flex-none">
                  <div className="c-pp -s40" style={profile_style}/>
                </div>
                <div className="c-tml-username flex-none">
                  <a href={profile_link}>{post.user_display_name}</a>
                </div>
                <div className="c-tml-status">{post.activity_detail.activity_title}</div>
              </div>
              <div className="layout-row card">
                <div className="layout-column flex-50 card-activity">
                  <div className="flex-none card-activity-parallax">
                    <div className="parallax">
                      <CcardParallax activity_detail={post.activity_detail}/>
                      {/*<img className="parallax-img" src={post.activity_detail.preview}/>*/}
                    </div>
                    <div className="card-activity-caption">{post.activity_detail.caption}</div>
                  </div>
                  <div className="layout-wrap layout-row">
                    <div className="-item ng-scope flex-nogrow card-activity-info">
                      <div className="layout-column layout-align-center-center card-activity-toggle">
                        <i className="ci-item-blank s-20"></i>
                        <span>No Item</span>
                      </div>
                    </div>
                    <div className="-item ng-scope flex-nogrow card-activity-info">
                      <div className="layout-column layout-align-center-center card-activity-toggle">
                        <i className="ci-item-blank s-20"></i>
                        <span>Item 1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CcardRight post={post}/>
              </div>
            </div>
          )
        });
      }
      return _return;
    };
    return (<div>{Card()}</div>);
  }
});
