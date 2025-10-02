<template>
  <view class="apply-container">
    <!-- 状态栏 -->
    <view class="status-bar" :style="statusBarStyle"></view>
    
    <!-- 顶部导航 -->
    <view class="top-bar" :style="topBarStyle">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="page-title">调课申请</text>
      </view>
    </view>

    <!-- 课程信息 -->
    <view class="course-info-section">
      <view class="section-title">课程信息</view>
      <view class="course-card">
        <view class="course-item">
          <text class="label">课程名称：</text>
          <text class="value">{{ courseInfo.courseName }}</text>
        </view>
        <view class="course-item">
          <text class="label">上课时间：</text>
          <text class="value">{{ courseInfo.date }} {{ courseInfo.time }}</text>
        </view>
        <view class="course-item">
          <text class="label">上课地点：</text>
          <text class="value">{{ courseInfo.location }}</text>
        </view>
        <view class="course-item">
          <text class="label">班级：</text>
          <text class="value">{{ courseInfo.className }}</text>
        </view>
      </view>
    </view>

    <!-- 申请表单 -->
    <view class="form-section">
      <view class="section-title">申请信息</view>
      
      <!-- 申请理由 -->
      <view class="form-item">
        <text class="form-label">申请理由 <text class="required">*</text></text>
        <textarea 
          class="form-textarea" 
          v-model="formData.reason" 
          placeholder="请输入申请调课的理由"
          maxlength="200"
          :disabled="isDetail"
        ></textarea>
        <text class="char-count">{{ formData.reason.length }}/200</text>
      </view>

      <!-- 新上课时间 -->
      <view class="form-item">
        <text class="form-label">新上课日期 <text class="required">*</text></text>
        <picker 
          mode="date" 
          :value="formData.newDate" 
          :start="today"
          @change="onDateChange"
          :disabled="isDetail"
        >
          <view class="picker-display">
            <text class="picker-text">{{ formData.newDate || '请选择新上课日期' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 新上课时间 -->
      <view class="form-item">
        <text class="form-label">新上课时间 <text class="required">*</text></text>
        <picker 
          mode="selector" 
          :range="timeOptions" 
          :value="timeIndex" 
          @change="onTimeChange"
          :disabled="isDetail"
        >
          <view class="picker-display">
            <text class="picker-text">{{ formData.newTime || '请选择新上课时间' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="submitApplication" :disabled="!canSubmit || isDetail">
        提交申请
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      courseInfo: {
        courseName: '',
        date: '',
        time: '',
        location: '',
        className: '',
        courseId: ''
      },
      formData: {
        reason: '',
        newDate: '',
        newTime: ''
      },
      today: '',
      timeOptions: [
        '8:00-10:00',
        '10:10-12:10',
        '14:00-16:00',
        '16:10-18:10',
        '18:00-20:00',
        '20:00-22:00'
      ],
      timeIndex: -1,
      statusBarHeight: 0,
      topBarPadding: 0,
      isDetail: false // 新增：用于控制表单是否为详情模式
    }
  },
  computed: {
    canSubmit() {
      return this.formData.reason.trim() && 
             this.formData.newDate && 
             this.formData.newTime;
    },
    statusBarStyle() {
      return `height: ${this.statusBarHeight}px; background-color: #1976D2;`;
    },
    topBarStyle() {
      return `padding-top: ${this.topBarPadding}px; background-color: #1976D2;`;
    }
  },
  onLoad(options) {
    // 获取今天日期
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    
    // 详情模式：通过changeId加载调课申请详情
    if (options.changeId) {
      this.loadChangeDetail(options.changeId);
    } else if (options.courseInfo) {
      // 新建模式：通过courseInfo参数
      this.courseInfo = JSON.parse(decodeURIComponent(options.courseInfo));
    }
    
    // 校验课程是否已开始，若已开始则禁止调课并返回
    if (this.courseInfo.date && this.courseInfo.time) {
      const now = new Date();
      const courseDate = new Date(this.courseInfo.date);
      // 新增：必须大于今天+5天
      const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
      if (courseDate < minDate) {
        uni.showToast({ title: '只能调五天之后的课程', icon: 'none' });
        setTimeout(() => { uni.navigateBack(); }, 1200);
        return;
      }
      let courseStartHour = null, courseStartMinute = null;
      // 解析时间字符串
      const match = /(\d{1,2}):(\d{2})-/.exec(this.courseInfo.time);
      if (match) {
        courseStartHour = parseInt(match[1], 10);
        courseStartMinute = parseInt(match[2], 10);
      }
      if (courseDate.getFullYear() === now.getFullYear() && courseDate.getMonth() === now.getMonth() && courseDate.getDate() === now.getDate()) {
        if (courseStartHour !== null && courseStartMinute !== null) {
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const courseStartMinutes = courseStartHour * 60 + courseStartMinute;
          if (nowMinutes >= courseStartMinutes) {
            uni.showToast({ title: '课程已开始，无法调课', icon: 'none' });
            setTimeout(() => { uni.navigateBack(); }, 1200);
          }
        }
      }
    }

    // 适配状态栏高度
    const sys = uni.getSystemInfoSync();
    this.statusBarHeight = sys.statusBarHeight || 20;
    this.topBarPadding = sys.statusBarHeight ? sys.statusBarHeight / 2 : 10;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    onDateChange(e) {
      this.formData.newDate = e.detail.value;
    },
    
    onTimeChange(e) {
      this.timeIndex = e.detail.value;
      this.formData.newTime = this.timeOptions[this.timeIndex];
    },

    async loadChangeDetail(changeId) {
      try {
        uni.showLoading({ title: '加载中...' });
        const res = await uniCloud.database()
          .collection('course_change_requests')
          .doc(changeId)
          .get();
        const data = res.result.data && res.result.data[0];
        if (!data) {
          uni.showToast({ title: '未找到调课申请', icon: 'none' });
          setTimeout(() => { uni.navigateBack(); }, 1200);
          return;
        }
        // 填充课程信息
        this.courseInfo = {
          courseName: data.courseName || '',
          date: data.originalDate || '',
          time: data.originalTime || '',
          location: data.location || '',
          className: data.className || '',
          courseId: data.courseId || ''
        };
        // 填充申请信息
        this.formData = {
          reason: data.reason || '',
          newDate: data.newDate || '',
          newTime: data.newTime || ''
        };
        // 禁用表单编辑和提交
        this.isDetail = true;
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' });
        setTimeout(() => { uni.navigateBack(); }, 1200);
      } finally {
        uni.hideLoading();
      }
    },
    
    async submitApplication() {
      const userInfo = uni.getStorageSync('userInfo');
      console.log('提交参数', {
        courseId: this.courseInfo.courseId,
        originalDate: this.courseInfo.date,
        originalTime: this.courseInfo.time,
        reason: this.formData.reason,
        newDate: this.formData.newDate,
        newTime: this.formData.newTime,
        teacherId: userInfo._id,
        teacherName: userInfo.teacherName || userInfo.username
      });
      if (!this.canSubmit) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }
      if (!this.courseInfo.courseId) {
        uni.showToast({ title: '课程ID缺失，无法提交', icon: 'none' });
        return;
      }
      try {
        uni.showLoading({ title: '提交中...' });
        const result = await uniCloud.callFunction({
          name: 'course-change',
          data: {
            action: 'submit',
            courseId: this.courseInfo.courseId,
            originalDate: this.courseInfo.date,
            originalTime: this.courseInfo.time,
            reason: this.formData.reason,
            newDate: this.formData.newDate,
            newTime: this.formData.newTime,
            teacherId: userInfo._id,
            teacherName: userInfo.teacherName || userInfo.username
          }
        });
        console.log('云函数返回', result);
        if ((result.result && result.result.success) || result.success) {
          uni.showToast({ title: '申请提交成功', icon: 'success' });
          setTimeout(() => { uni.navigateBack(); }, 1500);
        } else {
          console.error('云函数错误详情', result.result && result.result.error || result.error);
          uni.showToast({ title: (result.result && result.result.message) || result.message || '提交失败', icon: 'none' });
        }
      } catch (e) {
        console.error('云函数异常', e);
        uni.showToast({ title: '提交失败，请重试', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    }
  }
}
</script>

<style scoped>
.apply-container {
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

.course-info-section,
.form-section {
  margin: 30rpx;
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.course-card {
  background-color: #f8f9fa;
  border-radius: 15rpx;
  padding: 20rpx;
}

.course-item {
  display: flex;
  margin-bottom: 15rpx;
}

.course-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-size: 28rpx;
  min-width: 140rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
  flex: 1;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.required {
  color: #ff4757;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.picker-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  background-color: white;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.submit-section {
  margin: 30rpx;
  padding-bottom: 50rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background-color: #1976D2;
  color: white;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-btn:disabled {
  background-color: #ccc;
}
</style> 