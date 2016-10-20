var CcardParallax = React.createClass({
  displayName: 'CcardParallax',

  getInitialState: function () {
    return { status: 0 };
  },
  componentDidMount: function () {
    var me = this;
    var activity_detail = me.props.activity_detail; //console.log(activity_detail);
    var image = new Image();
    image.src = activity_detail.preview;
    // image.onload=function(){
    //   me.setState({status:1});
    // };
    setTimeout(function () {
      me.setState({ status: 1 });
    }, 3000);
  },
  render: function () {
    var activity_detail = this.props.activity_detail; //console.log(activity_detail);
    // var _html = <img className="parallax-img" width="436px" height="312px" src={activity_detail.preview} title={this.state.status}/>;
    var _html = null;
    switch (this.state.status) {
      case 0:
        _html = React.createElement(
          'div',
          { style: { width: '436px', height: '312px' } },
          this.state.status
        );break;
      case 1:
        _html = React.createElement('img', { className: 'parallax-img', width: '436px', height: '312px', src: activity_detail.preview, title: this.state.status });
    }
    return _html;
  }
});
//# sourceMappingURL=card-parallax-component.js.map
