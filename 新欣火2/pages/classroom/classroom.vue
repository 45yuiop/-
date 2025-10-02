<template>
  <view>
    <!-- 顶部安全区适配 -->
    <view :style="{height: statusBarHeight + 'px'}"></view>
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <image src="/static/3.png" class="back-icon"></image>
    </view>
    <!-- 教室使用情况标题 -->
    <view class="header">
      <text class="title">教室使用情况</text>
      <text class="subtitle"></text>
    </view>
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <picker :range="floorOptions" :value="selectedFloorIndex" @change="onFloorChange">
        <view class="picker">{{ floorOptions[selectedFloorIndex] }}</view>
      </picker>
      <picker mode="date" :value="selectedDate" @change="onDateChange">
        <view class="picker">{{ selectedDate }}</view>
      </picker>
      <picker :range="timeRanges" :value="selectedTimeIndex" @change="onTimeChange">
        <view class="picker">{{ timeRanges[selectedTimeIndex] }}</view>
      </picker>
    </view>
    <view class="classroom-page">
      <view class="floor-block" v-for="(floor, idx) in filteredClassroomsByFloor()" :key="idx">
        <view class="floor-title">{{ floor.floor }}</view>
        <view class="classroom-list">
          <view class="classroom-item" v-for="room in floor.rooms" :key="room.name">
            <view class="classroom-name">{{ room.name }}</view>
            <view class="classroom-status" :class="room.status === '空闲' ? 'free' : 'occupied'">
              <text v-if="room.status === '空闲'">空闲</text>
              <text v-else>占用</text>
            </view>
            <view v-if="room.status === '占用' && room.info" class="classroom-info">
              <text class="course-type" v-if="room.info.split(' ')[0]">{{ room.info.split(' ')[0] }}</text>
              <text class="grade-info" v-if="room.info.split(' ')[1]"> {{ room.info.split(' ')[1] }}</text>
              <text class="classroom-teacher" v-if="room.teacher">老师：{{ room.teacher }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      selectedDate: this.getToday(),
      timeRanges: ['8:00-10:00', '10:10-12:10', '14:00-16:00', '16:10-18:10'],
      selectedTimeIndex: 0,
      groupedClassrooms: [],
      floorOptions: ['全部', '二楼', '三楼'],
      selectedFloorIndex: 0
    }
  },
  methods: {
    getToday() {
      const d = new Date();
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    },
    onDateChange(e) {
      this.selectedDate = e.detail.value;
      this.fetchClassroomStatus();
    },
    onTimeChange(e) {
      this.selectedTimeIndex = Number(e.detail.value); // 确保为数字
      this.fetchClassroomStatus();
    },
    onFloorChange(e) {
      this.selectedFloorIndex = Number(e.detail.value);
    },
    filteredClassroomsByFloor() {
      if (this.selectedFloorIndex === 0) return this.groupedClassrooms;
      const floor = this.floorOptions[this.selectedFloorIndex];
      return this.groupedClassrooms.filter(f => f.floor === floor);
    },
    fetchClassroomStatus() {
      const slot = this.selectedTimeIndex + 1; // 1~4严格对应
      uniCloud.callFunction({
        name: 'classroom-status',
        data: {
          date: this.selectedDate,
          slot: slot
        },
        success: (res) => {
          console.log('classroom-status返回：', res);
          if (res.result && res.result.data) {
            this.groupedClassrooms = this.groupByFloor(res.result.data);
          }
        }
      });
    },
    groupByFloor(classroomList) {
      const floors = {};
      classroomList.forEach(room => {
        let floor = '三楼一对一教室';
        if (room.name.includes('致远') || room.name.includes('万木') || room.name.includes('棋乐无穷') || room.name.includes('知秋') || room.name.includes('千帆')) {
          floor = '二楼';
        } else if (/^6\d{2}/.test(room.name)) {
          floor = '三楼';
        }
        if (!floors[floor]) floors[floor] = [];
        floors[floor].push(room);
      });
      return Object.keys(floors).map(floor => ({ floor, rooms: floors[floor] }));
    },
    goBack() {
      uni.navigateBack();
    }
  },
  onLoad() {
    this.fetchClassroomStatus();
  }
}
</script>

<style scoped>
.classroom-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8eafe 0%, #cfd8fd 100%);
  padding: 24rpx;
  padding-top: 0;
}
.back-btn {
  position: absolute;
  top: 62rpx;
  left: 16rpx;
  z-index: 10;
  display: flex;
  align-items: center;
  background: #edeaff;
  border: 2rpx solid #a18fff;
  border-radius: 50%;
  width: 64rpx;
  height: 64rpx;
  box-shadow: 0 2rpx 8rpx #b3aaff;
  justify-content: center;
}
.back-icon {
  width: 44rpx;
  height: 44rpx;
  display: block;
}
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 12rpx 0 12rpx 0;
  background: rgba(255,255,255,0.7);
  border-radius: 24rpx;
  margin-bottom: 18rpx;
  box-shadow: 0 2rpx 8rpx #e0e7ff;
}
.picker {
  background: #fff;
  border: 2rpx solid #a18fff;
  border-radius: 16rpx;
  padding: 10rpx 28rpx;
  font-size: 28rpx;
  color: #5a4fcf;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.header {
  text-align: center;
  margin-bottom: 18rpx;
  margin-top: 12rpx;
}
.title {
  font-size: 48rpx;
  color: #3a2c1a;
  font-weight: bold;
  letter-spacing: 4rpx;
  text-shadow: 2rpx 2rpx 8rpx #e0c9a6;
}
.subtitle {
  font-size: 24rpx;
  color: #a89c8e;
  margin-top: 8rpx;
}
.floor-block {
  margin-bottom: 40rpx;
}
.floor-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  color: #4a3fa3;
  font-weight: bold;
  margin-bottom: 18rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 10rpx 24rpx;
  box-shadow: 0 2rpx 8rpx #e0e7ff;
}
.floor-title::before {
  content: '';
  display: inline-block;
  width: 12rpx;
  height: 32rpx;
  background: #4FC3F7;
  border-radius: 8rpx;
  margin-right: 16rpx;
}
.classroom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx 4vw;
  justify-content: flex-start;
}
.classroom-item {
  background: #fff;
  border: none;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx #e0e7ff;
  padding: 32rpx 0 24rpx 0;
  margin-bottom: 24rpx;
  min-width: 44vw;
  max-width: 48vw;
  flex: 1 1 44vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}
.classroom-item:active {
  box-shadow: 0 12rpx 32rpx #a18fff;
  background: #f3f6fd;
}
.classroom-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #3a2c1a;
  margin-bottom: 8rpx;
  letter-spacing: 2rpx;
}
.classroom-status {
  font-size: 28rpx;
  margin-bottom: 4rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.classroom-status.free {
  color: #4FC3F7;
  border: 2rpx solid #4FC3F7;
  border-radius: 8rpx;
  padding: 2rpx 12rpx;
  background: #e3f7fd;
  font-weight: bold;
}
.classroom-status.occupied {
  color: #FF6B6B;
  border: 2rpx solid #FF6B6B;
  border-radius: 8rpx;
  padding: 2rpx 12rpx;
  background: #ffe6f0;
  font-weight: bold;
}
.classroom-info {
  font-size: 24rpx;
  color: #7c5c2b;
  margin-top: 2rpx;
}
.classroom-teacher {
  font-size: 24rpx;
  color: #1976D2;
  margin-top: 2rpx;
}
.course-type {
  color: #7B61FF !important;
  font-weight: 500 !important;
  font-size: 25rpx !important;
  display: inline !important;
  margin-right: 8rpx;
}
.grade-info {
  color: #5B8EFF !important;
  font-weight: 500 !important;
  font-size: 25rpx !important;
  display: inline !important;
  margin-right: 8rpx;
}
</style> 