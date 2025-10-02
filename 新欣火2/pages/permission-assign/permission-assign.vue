<template>
  <view class="permission-assign-container">
    <view class="top-bar-no-bg">
      <view class="top-nav-flex">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <view class="page-title-center">权限分配</view>
      </view>
    </view>
    <view class="desc">可为成员分配你当前账号拥有的功能权限。</view>
    <view v-if="!isAdmin" class="no-feature-tip">
      你当前账号没有可分配的功能权限
    </view>
    <view v-else class="assign-section">
      <picker :range="memberList" range-key="teacherName" @change="onMemberChange">
        <view class="member-picker">
          <text>{{ selectedMember ? selectedMember.teacherName + '（' + (selectedMember.role || selectedMember.username) + '）' : '请选择成员' }}</text>
        </view>
      </picker>
      <view v-if="selectedMember" class="feature-list">
        <checkbox-group :value="memberFeatures" @change="onFeatureChange">
          <checkbox
            v-for="feature in allAssignableFeatures"
            :key="feature.key"
            :value="feature.key"
          >
            {{ feature.name }}
          </checkbox>
        </checkbox-group>
        <button class="save-btn" :disabled="saveLoading" @click="saveFeatures">
          <text v-if="!saveLoading">保存</text>
          <text v-else>保存中...</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import featureListConfig from '@/utils/featureList.js';

export default {
  data() {
    return {
      memberList: [],
      selectedMember: null,
      memberFeatures: [],
      saveLoading: false,
      isAdmin: false,
      allAssignableFeatures: featureListConfig.filter(f => f.assignable)
    };
  },
  onShow() {
    const userInfo = uni.getStorageSync('userInfo');
    this.isAdmin = userInfo && (
      userInfo.permission === '管理员' ||
      (Array.isArray(userInfo.role) && userInfo.role.includes('管理员')) ||
      userInfo.permission === 'superadmin'
    );
    this.initData();
  },
  methods: {
    goBack() {
      if (getCurrentPages().length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({ url: '/pages/home/home' });
      }
    },
    async initData() {
      const userInfo = uni.getStorageSync('userInfo');
      // 获取所有成员（过滤家长、自己、管理员）
      const res = await uniCloud.callFunction({
        name: 'user-center',
        data: { action: 'get-accounts' }
      });
      if (res.result && res.result.code === 200) {
        this.memberList = res.result.data.filter(acc => {
          // 过滤家长、自己、管理员（无论 role 还是 permission 字段）
          const isParent = acc.role && (Array.isArray(acc.role) ? acc.role.includes('家长') : acc.role === '家长');
          const isAdminRole = acc.role && (Array.isArray(acc.role) ? acc.role.includes('管理员') : acc.role === '管理员');
          const isAdminPermission = acc.permission === '管理员' || acc.permission === 'superadmin';
          const isSelf = acc._id === userInfo._id;
          return !isParent && !isSelf && !isAdminRole && !isAdminPermission;
        });
      }
      this.selectedMember = null;
      this.memberFeatures = [];
    },
    onMemberChange(e) {
      const idx = e.detail.value;
      this.selectedMember = this.memberList[idx];
      this.memberFeatures = Array.isArray(this.selectedMember.featureList) ? [...this.selectedMember.featureList] : [];
    },
    onFeatureChange(e) {
      this.memberFeatures = e.detail.value;
    },
    async saveFeatures() {
      if (!this.selectedMember) return;
      this.saveLoading = true;
      const featuresToSave = Array.isArray(this.memberFeatures) ? Array.from(this.memberFeatures) : [];
      console.log('即将保存的功能权限:', featuresToSave);
      console.log('目标账号ID:', this.selectedMember._id);
      const res = await uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'update-account',
          params: {
            id: this.selectedMember._id,
            featureList: featuresToSave
          }
        }
      });
      console.log('云函数返回:', res);
      this.saveLoading = false;
      uni.showToast({ title: '保存成功', icon: 'success' });
      // 刷新成员列表，保持数据同步
      this.initData();
    }
  }
}
</script>

<style scoped>
.permission-assign-container {
  padding: 60rpx 30rpx 30rpx 30rpx;
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
}
.top-bar-no-bg {
  background: none;
  box-shadow: none;
}
.top-nav-flex {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0;
  margin-bottom: 30rpx;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}
.back-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.3);
}
.back-icon {
  font-size: 18px;
  font-weight: bold;
}
.back-text {
  font-size: 14px;
  font-weight: 500;
}
.page-title-center {
  flex: 1;
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  color: #1976D2;
  margin-left: -40rpx;
}
.desc {
  font-size: 30rpx;
  color: #555;
  margin-bottom: 30rpx;
}
.no-feature-tip {
  color: #f56c6c;
  text-align: center;
  margin: 40rpx 0 60rpx 0;
  font-size: 32rpx;
}
.assign-section {
  margin-top: 20rpx;
}
.member-picker {
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: #1976D2;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.06);
}
.feature-list {
  margin-bottom: 30rpx;
}
.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
}
.feature-name {
  margin-left: 18rpx;
  font-size: 30rpx;
}
.save-btn {
  width: 100%;
  background: linear-gradient(90deg, #667eea 0%, #4fc3f7 100%);
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  border: none;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(76,195,247,0.15);
  padding: 28rpx 0;
  transition: background 0.3s;
  margin-top: 30rpx;
}
.save-btn:active {
  background: linear-gradient(90deg, #4fc3f7 0%, #667eea 100%);
  opacity: 0.85;
}
.save-btn[disabled] {
  opacity: 0.6;
}
</style> 