<template>
  <view class="message-page">
    <view class="status-bar"></view>
    <view class="top-bar">
      <view class="top-nav">
        <view class="page-title">消息中心</view>
      </view>
    </view>
    
    <!-- 消息分类标签 -->
    <view class="message-tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'all' }"
        @click="switchTab('all')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'notification' }"
        @click="switchTab('notification')"
      >
        通知
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'system' }"
        @click="switchTab('system')"
      >
        系统消息
      </view>
    </view>
    
    <!-- 消息列表 -->
    <view class="content">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <view class="loading-icon">🔄</view>
        <view class="loading-text">加载中...</view>
      </view>
      
      <!-- 空状态 -->
      <view v-else-if="filteredMessages.length === 0" class="empty-state">
        <view class="empty-icon">📭</view>
        <view class="empty-text">暂无消息</view>
        <view class="empty-desc">您还没有收到任何消息</view>
      </view>
      
      <!-- 消息列表 -->
      <view v-else class="message-list">
        <view 
          v-for="message in filteredMessages" 
          :key="message._id" 
          class="message-item"
          :class="{ unread: !message.read }"
          @click="readMessage(message)"
        >
          <view class="message-icon">
            <text v-if="message.type === 'notification'">🔔</text>
            <text v-else-if="message.type === 'system'">⚙️</text>
            <text v-else-if="message.type === 'schedule'">📅</text>
            <text v-else-if="message.type === 'courseChange'">🔄</text>
            <text v-else>✉️</text>
          </view>
          <view class="message-content">
            <view class="message-title">{{ message.title }}</view>
            <view class="message-preview">{{ getMessagePreview(message) }}</view>
            <view class="message-meta">
              <text class="message-time">{{ formatTime(message.createTime) }}</text>
              <text v-if="!message.read" class="unread-dot">●</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-actions" v-if="filteredMessages.length > 0 && !loading">
      <button class="action-btn mark-all-read" @click="markAllRead">
        全部已读
      </button>
      <button class="action-btn clear-all" @click="clearAllMessages">
        清空消息
      </button>
    </view>
    
    <!-- 订阅设置提示 -->
    <view class="subscription-prompt" v-if="showSubscriptionPrompt">
      <view class="prompt-content">
        <view class="prompt-icon">🔔</view>
        <view class="prompt-text">
          <view class="prompt-title">开启订阅通知</view>
          <view class="prompt-desc">及时接收课程安排和系统通知</view>
        </view>
        <button class="prompt-btn" @click="goToSubscription">去设置</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      activeTab: 'all',
      messages: [],
      loading: true,
      showSubscriptionPrompt: false
    }
  },
  computed: {
    filteredMessages() {
      if (this.activeTab === 'all') {
        return this.messages;
      }
      return this.messages.filter(msg => msg.type === this.activeTab);
    }
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
    this.loadMessages();
    this.checkSubscriptionStatus();
  },
  methods: {
    async loadMessages() {
      this.loading = true;
      try {
        // 获取系统消息（新闻）
        const newsRes = await uniCloud.callFunction({
          name: 'news-service',
          data: {
            action: 'listNews',
            page: 1,
            pageSize: 20
          }
        });
        
        let systemMessages = [];
        if (newsRes.result.code === 0) {
          systemMessages = newsRes.result.data.map(news => ({
            _id: 'news_' + news._id,
            title: news.title,
            content: this.extractTextFromContentBlocks(news.contentBlocks),
            contentBlocks: news.contentBlocks,
            type: 'system',
            read: false,
            createTime: new Date(news.createTime),
            source: 'news',
            newsId: news._id
          }));
        }
        
        // 获取调课申请消息（如果是管理员）
        let courseChangeMessages = [];
        if (this.userInfo && (this.userInfo.permission === '管理员' || this.userInfo.permission === 'superadmin')) {
          try {
            const courseChangeRes = await uniCloud.callFunction({
              name: 'course-change',
              data: {
                action: 'list'
              }
            });
            
            if (courseChangeRes.result && courseChangeRes.result.success) {
              courseChangeMessages = courseChangeRes.result.data
                .filter(app => app.status === 'pending')
                .map(app => ({
                  _id: 'courseChange_' + app._id,
                  title: '调课申请待审批',
                  content: `${app.teacherName}申请调课：${app.courseName}，原时间：${app.originalDate} ${app.originalTime}，新时间：${app.newDate} ${app.newTime}`,
                  type: 'courseChange',
                  read: false,
                  createTime: new Date(app.createTime),
                  source: 'courseChange',
                  applicationId: app._id
                }));
            }
          } catch (error) {
            console.error('获取调课申请失败:', error);
          }
        }
        
        // 合并所有消息并按时间排序
        this.messages = [...systemMessages, ...courseChangeMessages]
          .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
          
      } catch (error) {
        console.error('获取消息失败:', error);
        this.loadDemoMessages();
      } finally {
        this.loading = false;
      }
    },
    
    loadDemoMessages() {
      // 如果无法获取真实数据，使用演示数据
      this.messages = [
        {
          _id: '1',
          title: '排课通知',
          content: '您有一节新的课程已安排，请查看课表',
          type: 'notification',
          read: false,
          createTime: new Date(Date.now() - 3600000) // 1小时前
        },
        {
          _id: '2',
          title: '系统维护通知',
          content: '系统将于今晚22:00-24:00进行维护，请提前保存数据',
          type: 'system',
          read: true,
          createTime: new Date(Date.now() - 86400000) // 1天前
        },
        {
          _id: '3',
          title: '调课申请',
          content: '您有一条调课申请待审批',
          type: 'courseChange',
          read: false,
          createTime: new Date(Date.now() - 1800000) // 30分钟前
        },
        {
          _id: '4',
          title: '新功能上线',
          content: '成绩分析功能已上线，欢迎体验',
          type: 'system',
          read: true,
          createTime: new Date(Date.now() - 172800000) // 2天前
        }
      ];
    },
    
    extractTextFromContentBlocks(contentBlocks) {
      if (!contentBlocks || !Array.isArray(contentBlocks)) return '';
      
      return contentBlocks
        .filter(block => block.type === 'text')
        .map(block => block.content)
        .join(' ');
    },
    
    getMessagePreview(message) {
      // 如果有contentBlocks，提取纯文本预览
      if (message.contentBlocks) {
        return this.extractTextFromContentBlocks(message.contentBlocks).substring(0, 50) + '...';
      }
      // 否则使用content字段
      return message.content ? message.content.substring(0, 50) + '...' : '';
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    readMessage(message) {
      // 标记为已读
      message.read = true;
      
      // 根据消息类型进行不同处理
      if (message.source === 'news') {
        // 系统新闻消息，跳转到详情页
        uni.navigateTo({
          url: `/pages/news-detail/news-detail?id=${message.newsId}`
        });
      } else if (message.source === 'courseChange') {
        // 调课申请消息，跳转到审批页面
        uni.navigateTo({
          url: `/pages/course-change-approval/course-change-approval`
        });
      } else {
        uni.showToast({
          title: '标记为已读',
          icon: 'none'
        });
      }
    },
    
    markAllRead() {
      this.messages.forEach(msg => {
        msg.read = true;
      });
      uni.showToast({
        title: '全部标记为已读',
        icon: 'success'
      });
    },
    
    clearAllMessages() {
      uni.showModal({
        title: '清空消息',
        content: '确定要清空所有消息吗？此操作不可恢复',
        success: (res) => {
          if (res.confirm) {
            this.messages = [];
            uni.showToast({
              title: '消息已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    
    formatTime(time) {
      const now = new Date();
      const msgTime = new Date(time);
      const diff = now - msgTime;
      
      // 如果是今天
      if (msgTime.toDateString() === now.toDateString()) {
        return `${msgTime.getHours().toString().padStart(2, '0')}:${msgTime.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // 如果是昨天
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (msgTime.toDateString() === yesterday.toDateString()) {
        return `昨天 ${msgTime.getHours().toString().padStart(2, '0')}:${msgTime.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // 其他情况显示日期
      return `${msgTime.getMonth() + 1}-${msgTime.getDate()}`;
    },
    
    // 检查订阅状态
    async checkSubscriptionStatus() {
      try {
        const openid = uni.getStorageSync('openid');
        if (!openid) {
          this.showSubscriptionPrompt = true;
          return;
        }
        
        // 检查云端订阅状态
        const res = await uniCloud.callFunction({
          name: 'subscription-message',
          data: {
            action: 'get-subscription-status',
            openid: openid
          }
        });
        
        if (res.result.code === 200) {
          this.showSubscriptionPrompt = !res.result.data.isSubscribed;
        } else {
          this.showSubscriptionPrompt = true;
        }
      } catch (error) {
        console.error('检查订阅状态失败:', error);
        this.showSubscriptionPrompt = true;
      }
    },
    
    // 跳转到订阅设置页面
    goToSubscription() {
      uni.navigateTo({
        url: '/pages/subscription-settings/subscription-settings'
      });
    }
  }
}
</script>

<style scoped>
.message-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.status-bar {
  height: var(--status-bar-height);
  background-color: #1976D2;
}

.top-bar {
  background-color: #1976D2;
  padding: 20rpx 30rpx;
}

.top-nav {
  display: flex;
  align-items: center;
  position: relative;
}

.page-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

/* 消息分类标签 */
.message-tabs {
  display: flex;
  background: white;
  border-bottom: 1rpx solid #e0e0e0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 30rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #1976D2;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 6rpx;
  background: #1976D2;
  border-radius: 3rpx;
}

.content {
  padding: 20rpx;
  min-height: calc(100vh - 200rpx);
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 100rpx 40rpx;
}

.loading-icon {
  font-size: 80rpx;
  margin-bottom: 30rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 32rpx;
  color: #666;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
}

/* 消息列表 */
.message-list {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
}

.message-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item.unread {
  background: #f0f8ff;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-preview {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-time {
  font-size: 24rpx;
  color: #999;
}

.unread-dot {
  color: #ff6b6b;
  font-size: 20rpx;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx;
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #e0e0e0;
}

.action-btn {
  flex: 1;
  margin: 0 10rpx;
  padding: 20rpx 0;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
}

.mark-all-read {
  background: #1976D2;
  color: white;
}

.clear-all {
  background: #f5f5f5;
  color: #666;
}

.action-btn:active {
  opacity: 0.8;
}

/* 订阅设置提示 */
.subscription-prompt {
  position: fixed;
  bottom: 120rpx;
  left: 20rpx;
  right: 20rpx;
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  padding: 30rpx;
  z-index: 100;
}

.prompt-content {
  display: flex;
  align-items: center;
}

.prompt-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
  color: #1976D2;
}

.prompt-text {
  flex: 1;
}

.prompt-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.prompt-desc {
  font-size: 24rpx;
  color: #666;
}

.prompt-btn {
  background: #1976D2;
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 15rpx 30rpx;
  font-size: 24rpx;
}
</style>