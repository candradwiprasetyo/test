var CcardRightCimotion = React.createClass({
  render:function(){
    var post = this.props.post;
    var reaction_most = 'https://beta.ciayo.com/assets/svg/notif-cimotion-ciayo.svg';
    function cimotionMouseEnter(e){
      var el =angular.element(e.target);
      el.addClass('-roll');
      el.off('animationiteration webkitAnimationIteration', move);
    }
    function cimotionMouseLeave(e){
      var el =angular.element(e.target);
      el.on('animationiteration webkitAnimationIteration', move);
    }
    function move() {
      angular.element(this).removeClass("-roll");
    }
    return(
          <div className="layout-row flex-none card-tab -head">
            <div className="layout-row flex card-react">
              <div className="_topmost flex-none"><img src="https://beta.ciayo.com/assets/img/reaction/Wow-color.png"/></div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/hand.svg")'}} className=" flex-none _reaction -s40" title="CIAYO" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/chips.svg")'}} className=" flex-none _reaction -s40" title="WOW" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/crocket.svg")'}} className=" flex-none _reaction -s40" title="HAPPY" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/coco.svg")'}} className=" flex-none _reaction -s40" title="LOVE" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/carla.svg")'}} className=" flex-none _reaction -s40" title="ANGRY" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
              <div className="flex-noshrink layout-row layout-align-center-center _reaction_item">
                <div md-ink-ripple="#000000" style={{'background-image': 'url("https://beta.ciayo.com/assets/img/reaction/chuck.svg")'}} className=" flex-none _reaction -s40" title="SAD" onMouseEnter={cimotionMouseEnter} onMouseLeave={cimotionMouseLeave}></div>
              </div>
            </div>
            
            <div className="layout-align-center-center layout-row card-tab-toggle">
              <span className="flex">
                <span>
                  {post.reaction.detail.count}</span> People give reaction &nbsp;
                </span>
            </div>
          </div>
    );
  }
});
var CcardRightComment = React.createClass({
  render:function(){
    return (
      <div className="flex-none card-tab">
        <div className="layout-column layout-align-center-center card-tab-toggle">
          <i className="ci-comment s-20"/>
          <span>1</span>
        </div>
        <div className="layout-row card-pane">
          {/*comment-list*/}
          <div className="layout-column flex card-comment-block">
            <div class="flex-none card-comment-more">
              <span>View more comment...</span>
            </div>
            <div className="flex-none card-comment-more">
              <span>Load more comment...</span>
            </div>
            <div className="flex-grow card-comments">
              <div className="_empty-comment">
                <span>No comment on this post!</span>
              </div>
              {/*comment repeat*/}
            </div>
            <div className="flex-none layout-row card-comment-box">
              <div className="flex-initial _userimage">
                <div className="c-pp -s30"></div>
              </div>
            </div>
          </div>
          {/*end of comment-list*/}
          {/*comment edit*/}
          <div className="layout-column card-comment-nested">
            <div className="flex-none card-comment-back">

            </div>
          </div>
          {/*end of comment edit*/}
        </div>
      </div>
    );
  }
})
var CcardRightShare = React.createClass({
  render : function(){
    return (
      <div className="flex-none card-tab">
        <div className="layout-column layout-align-center-center card-tab-toggle">
          <i className="ci-share s-20"/>
          <span>234</span>
        </div>
        <div className="layout-column card-pane">
          <div className="flex-none layout-row card-share-activity">
            <div className="flex">Share your activity</div>
            <a href="#" className="_media _instagram"><i className="ci-instagram s-24"></i></a>
            <a href="#" className="_media _twitter"><i className="ci-twitter s-24"></i></a>
            <a href="#" className="_media _facebook"><i className="ci-facebook s-24"></i></a>
          </div>
          <div className="flex">
            <div className="_empty-share">
              <span> No body share this post</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
var CcardRightDownload = React.createClass({
  render : function() {
    return (
      <div className="flex-none card-tab">
        <div className="layout-column layout-align-center-center card-tab-toggle">
          <i className="ci-download s-20"/>
        </div>
      </div>
    );
  }
});
var CcardRightCButton= React.createClass({
  render : function() {
    return (
      <div className="flex-none card-tab">
        <div className="layout-column layout-align-center-center card-tab-toggle">
          <i className="ci-c-button s-20"/>
        </div>
      </div>
    );
  }
});
var CcardRightSetting = React.createClass({
  render:function(){
    return (
      <div className="flex-none card-tab">
        <div className="layout-column layout-align-center-center card-tab-toggle">
          <i className="ci-etc-outline s-20"/>
        </div>
        <div className="layout-column card-pane">
          <div className="flex layout-row card-option">
            <div className="flex layout-column layout-align-center-center card-option-button">
              <div className="flex-none _option">
                <div className="_button">Post Permission</div>
              </div>
              <div className="flex-none _option">
                <div className="_button">Report Post</div>
              </div>
              <div className="flex-none _option">
                <div className="_button">Turn Off Notification</div>
              </div>
              <div className="flex-none _option">
                <div className="_button">Edit Post</div>
                <div className="_dropdown">
                  <div className="_button">Caption</div>
                  <div className="_button">With</div>
                </div>
              </div>
              <div className="flex-none _option">
                <div className="_button">Delete Pot</div>
              </div>
            </div>
            <div className="layout-column -permission card-option-pane">
              <div className="flex-none _head">
                <div class="_button -back">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
var CcardRight = React.createClass({
  render: function() {
    var post = this.props.post;
    return (
      <div className="layout-column flex-50 card-right">
        <CcardRightCimotion post={post}/>
        <CcardRightComment post={post}/>
        <CcardRightShare post={post}/>
        <CcardRightDownload post={post}/>
        <CcardRightSetting post={post}/>
        <CcardRightCButton post={post}/>
        <div className="card-tab-active"/>
      </div>
    );
  }
});