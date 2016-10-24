       <script id="poll-more.html" type="text/ng-template">
    <ion-popover-view class="custom-popover">
        <ion-content>
          <div class="list">
            <a class="item" target="_blank" ng-click="performTask('like', like_pollid)" ng-if="!pollLiked">
              Like 
            </a>
            <a class="item" target="_blank" ng-click="performTask('unlike', like_pollid)" ng-if="pollLiked">
              Unlike 
            </a>
            <a class="item"  target="_blank" ng-click="performTask('notify', like_pollid)" ng-if="!pollNotify">
             Notify Me
            </a>

            <a class="item"  target="_blank" ng-click="performTask('unNotifyMe', like_pollid)" ng-if="pollNotify">
             Unotify
            </a>
            <a class="item"  target="_blank" ng-click="performTask('report', like_pollid)">
             Report Content
            </a>
 
          </div>
        </ion-content>
      </ion-popover-view>
      </script>