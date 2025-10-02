<template>
  <view class="approval-container">
    <!-- 状态栏 -->
    <view class="status-bar" :style="statusBarStyle"></view>
    
    <!-- 顶部导航 -->
    <view class="top-bar" :style="topBarStyle">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="page-title">调课审批</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view 
        class="filter-tab" 
        :class="{ active: currentFilter === 'all' }"
        @click="setFilter('all')"
      >
        全部
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: currentFilter === 'pending' }"
        @click="setFilter('pending')"
      >
        待审批
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: currentFilter === 'approved' }"
        @click="setFilter('approved')"
      >
        已通过
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: currentFilter === 'rejected' }"
        @click="setFilter('rejected')"
      >
        已拒绝
      </view>
    </view>

    <!-- 申请列表 -->
    <view class="application-list">
      <view v-if="filteredApplications.length === 0" class="empty-state">
        <text class="empty-text">暂无调课申请</text>
      </view>
      
      <view 
        v-for="(application, index) in filteredApplications" 
        :key="application._id"
        class="application-card"
      >
        <!-- 申请头部 -->
        <view class="card-header">
          <view class="teacher-info">
            <text class="teacher-name">{{ application.teacherName }}</text>
            <text class="apply-time">{{ formatDate(application.createTime) }}</text>
          </view>
          <view class="status-badge"
                :class="application.status === 'pending' ? 'status-pending' : (application.status === 'approved' ? 'status-approved' : 'status-rejected')">
            {{ application.status === 'pending' ? '待审批' : (application.status === 'approved' ? '已通过' : '已拒绝') }}
          </view>
        </view>

        <!-- 课程信息 -->
        <view class="course-info">
          <view class="course-title">{{ application.courseName }}</view>
          <view class="time-change">
            <view class="original-time">
              <text class="time-label">原时间：</text>
              <text class="time-value">{{ application.originalDate }} {{ application.originalTime }}</text>
            </view>
            <view class="arrow">→</view>
            <view class="new-time">
              <text class="time-label">新时间：</text>
              <text class="time-value">{{ application.newDate }} {{ application.newTime }}</text>
            </view>
          </view>
          <view class="course-details">
            <text class="detail-item">地点：{{ application.location }}</text>
            <text class="detail-item">班级：{{ application.className }}</text>
          </view>
        </view>

        <!-- 申请理由 -->
        <view class="reason-section">
          <text class="reason-label">申请理由：</text>
          <text class="reason-content">{{ application.reason }}</text>
        </view>

        <!-- 审批操作 -->
        <view v-if="application.status === 'pending'" class="approval-actions">
          <button class="reject-btn" @click="rejectApplication(application)">拒绝</button>
          <button class="approve-btn" @click="approveApplication(application)">通过</button>
        </view>

        <!-- 审批结果 -->
        <view v-if="application.status !== 'pending'" class="approval-result">
          <text class="result-text">
            {{ application.status === 'approved' ? '审批通过' : '审批拒绝' }}
            <text v-if="application.approvalTime" class="result-time">
              ({{ formatDate(application.approvalTime) }})
            </text>
            <text v-if="application.approverName" class="result-approver"> - {{ application.approverName }}</text>
          </text>
          <text v-if="application.approvalRemark" class="approval-remark">
            备注：{{ application.approvalRemark }}
          </text>
        </view>
      </view>
    </view>
    <uni-popup ref="rejectDialog" type="dialog">
      <view class="reject-dialog-content">
        <view class="reject-title">请输入拒绝理由</view>
        <textarea v-model="rejectReason" class="reject-textarea" placeholder="请填写拒绝调课理由" maxlength="200"></textarea>
        <view class="reject-dialog-actions">
          <button class="reject-cancel-btn" @click="closeRejectDialog">取消</button>
          <button class="reject-confirm-btn" @click="submitReject">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      applications: [],
      currentFilter: 'all',
      isLoading: false,
      statusBarHeight: 0,
      topBarPadding: 0,
      showRejectDialog: false,
      rejectReason: '',
      rejectApplicationId: ''
    }
  },
  computed: {
    filteredApplications() {
      if (this.currentFilter === 'all') {
        return this.applications;
      }
      return this.applications.filter(app => app.status === this.currentFilter);
    },
    statusBarStyle() {
      return `height: ${this.statusBarHeight}px; background-color: #1976D2;`;
    },
    topBarStyle() {
      return `padding-top: ${this.topBarPadding}px; background-color: #1976D2;`;
    }
  },
  onLoad() {
    this.loadApplications();
    // 适配状态栏高度
    const sys = uni.getSystemInfoSync();
    this.statusBarHeight = sys.statusBarHeight || 20;
    this.topBarPadding = sys.statusBarHeight ? sys.statusBarHeight / 2 : 10;
  },
  onShow() {
    this.loadApplications();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    setFilter(filter) {
      this.currentFilter = filter;
    },
    
    async loadApplications() {
      try {
        this.isLoading = true;
        const userInfo = uni.getStorageSync('userInfo');
        let data = { action: 'list' };
        // 只要是管理员或superadmin就能看到所有申请
        const isAdmin = userInfo && (userInfo.permission === '管理员' || userInfo.permission === 'superadmin');
        if (!isAdmin) {
          data.teacherId = userInfo._id;
        }
        const result = await uniCloud.callFunction({
          name: 'course-change',
          data
        });
        if ((result.result && result.result.success) || result.success) {
          this.applications = (result.result && result.result.data) || result.data || [];
        } else {
          uni.showToast({ title: (result.result && result.result.message) || result.message || '加载失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.isLoading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    
    getStatusClass(status) {
      const statusMap = {
        pending: 'status-pending',
        approved: 'status-approved',
        rejected: 'status-rejected'
      };
      return statusMap[status] || 'status-pending';
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '待审批',
        approved: '已通过',
        rejected: '已拒绝'
      };
      return statusMap[status] || '待审批';
    },
    
    async approveApplication(application) {
      try {
        uni.showLoading({
          title: '处理中...'
        });

        const userInfo = uni.getStorageSync('userInfo');
        const approverName = userInfo.teacherName || userInfo.username || '';

        const result = await uniCloud.callFunction({
          name: 'course-change',
          data: {
            action: 'approve',
            applicationId: application._id,
            status: 'approved',
            approverName
          }
        });

        uni.hideLoading();

        if (result.result.success) {
          uni.showToast({
            title: '审批通过',
            icon: 'success'
          });
          this.loadApplications();
        } else {
          uni.showToast({
            title: result.result.message || '操作失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('审批失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    
    async rejectApplication(application) {
      this.rejectApplicationId = application._id;
      this.rejectReason = '';
      this.$refs.rejectDialog.open();
    },
    closeRejectDialog() {
      this.$refs.rejectDialog.close();
    },
    async submitReject() {
      if (!this.rejectReason.trim()) {
        uni.showToast({ title: '请填写拒绝理由', icon: 'none' });
        return;
      }
      try {
        uni.showLoading({ title: '处理中...' });
        const userInfo = uni.getStorageSync('userInfo');
        const approverName = userInfo.teacherName || userInfo.username || '';
        const result = await uniCloud.callFunction({
          name: 'course-change',
          data: {
            action: 'approve',
            applicationId: this.rejectApplicationId,
            status: 'rejected',
            approverName,
            approvalRemark: this.rejectReason
          }
        });
        uni.hideLoading();
        this.$refs.rejectDialog.close();
        if (result.result.success) {
          uni.showToast({ title: '已拒绝', icon: 'success' });
          this.loadApplications();
        } else {
          uni.showToast({ title: result.result.message || '操作失败', icon: 'none' });
        }
      } catch (error) {
        uni.hideLoading();
        this.$refs.rejectDialog.close();
        uni.showToast({ title: '操作失败', icon: 'none' });
      }
    }
  }
}
</script>

<style scoped>
.approval-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 适配安全区 */
  padding-bottom: env(safe-area-inset-bottom);
}

.status-bar {
  width: 100%;
  background-color: #1976D2;
}

.top-bar {
  background-color: #1976D2;
  padding: 20rpx 30rpx 20rpx 30rpx;
  /* 顶部padding由js动态设置 */
}

.nav-content {
  display: flex;
  align-items: center;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  color: white;
}

.back-icon {
  font-size: 40rpx;
  margin-right: 10rpx;
}

.back-text {
  font-size: 32rpx;
}

.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.filter-tabs {
  display: flex;
  background-color: white;
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 15rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 10rpx;
  margin: 0 10rpx;
}

.filter-tab.active {
  background-color: #1976D2;
  color: white;
}

.application-list {
  padding: 30rpx;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

.application-card {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.teacher-info {
  display: flex;
  flex-direction: column;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.apply-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: white;
}

.status-pending {
  background-color: #ff9800;
}

.status-approved {
  background-color: #4caf50;
}

.status-rejected {
  background-color: #f44336;
}

.course-info {
  margin-bottom: 20rpx;
}

.course-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.time-change {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.original-time,
.new-time {
  flex: 1;
}

.time-label {
  font-size: 24rpx;
  color: #666;
}

.time-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.arrow {
  margin: 0 20rpx;
  color: #1976D2;
  font-size: 28rpx;
}

.course-details {
  display: flex;
  gap: 30rpx;
}

.detail-item {
  font-size: 24rpx;
  color: #666;
}

.reason-section {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
}

.reason-label {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.reason-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.approval-actions {
  display: flex;
  gap: 20rpx;
}

.reject-btn,
.approve-btn {
  flex: 1;
  height: 70rpx;
  border: none;
  border-radius: 35rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
}

.approval-result {
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
}

.result-text {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.result-time {
  font-weight: normal;
  color: #666;
}

.result-approver {
  font-size: 24rpx;
  color: #1976D2;
  margin-left: 10rpx;
}

.approval-remark {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}
.reject-dialog-content {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx 30rpx 30rpx;
  width: 500rpx;
  box-sizing: border-box;
}
.reject-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.reject-textarea {
  width: 100%;
  min-height: 120rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.reject-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}
.reject-cancel-btn {
  background: #eee;
  color: #333;
  border-radius: 30rpx;
  font-size: 28rpx;
  padding: 10rpx 30rpx;
}
.reject-confirm-btn {
  background: #f44336;
  color: #fff;
  border-radius: 30rpx;
  font-size: 28rpx;
  padding: 10rpx 30rpx;
}
</style> 