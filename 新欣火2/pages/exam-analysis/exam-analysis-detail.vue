<template>
  <view class="page-container">
    <view class="exam-analysis-detail-container">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">试卷分析详情</view>
      </view>
      
      <!-- 加载中 -->
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <!-- 详情内容 -->
      <view v-else-if="analysisData" class="detail-content">
        <!-- 基本信息 -->
        <view class="section">
          <view class="section-title">基本信息</view>
          <view class="info-row">
            <text class="label">年份：</text>
            <text class="value">{{ analysisData.year }}</text>
          </view>
          <view class="info-row">
            <text class="label">月份：</text>
            <text class="value">{{ analysisData.month }}</text>
          </view>
          <view class="info-row">
            <text class="label">年级：</text>
            <text class="value">{{ analysisData.grade || '未知年级' }}</text>
          </view>
          <view class="info-row">
            <text class="label">学生：</text>
            <text class="value clickable" @click="viewStudentDetail">{{ analysisData.studentName || '未知学生' }}</text>
          </view>
          <view class="info-row">
            <text class="label">考试类型：</text>
            <text class="value">{{ analysisData.examType }}</text>
          </view>
          <view class="info-row">
            <text class="label">创建时间：</text>
            <text class="value">{{ formatTime(analysisData.createTime) }}</text>
          </view>
          <view class="info-row">
            <text class="label">创建人：</text>
            <text class="value clickable" @click="viewUserDetail">{{ analysisData.userName || '未知用户' }}</text>
          </view>
        </view>
        
        <!-- 试卷图片 -->
        <view class="section">
          <view class="section-title">试卷图片</view>
          <view class="image-list">
            <view 
              v-for="(image, index) in analysisData.examImages" 
              :key="index"
              class="image-item"
              @click="openImageZoom(analysisData.examImages, index)"
            >
              <image :src="image" class="exam-image" mode="aspectFit" />
            </view>
          </view>
        </view>
        
        <!-- 试卷分析 -->
        <view class="section">
          <view class="section-title">试卷分析</view>
          <view v-if="analysisData.analysisText" class="analysis-text">
            {{ analysisData.analysisText }}
          </view>
          <view v-if="analysisData.analysisImages && analysisData.analysisImages.length > 0" class="image-list">
            <view 
              v-for="(image, index) in analysisData.analysisImages" 
              :key="index"
              class="image-item"
              @click="openImageZoom(analysisData.analysisImages, index)"
            >
              <image :src="image" class="analysis-image" mode="aspectFit" />
            </view>
          </view>
        </view>
        
        <!-- 评分信息 -->
        <view class="section">
          <view class="section-title">评分信息</view>
          <view class="rating-row">
            <text class="label">考试难度：</text>
            <view class="stars">
              <text 
                v-for="index in 5" 
                :key="index"
                class="star"
                :class="{ active: index <= analysisData.difficultyRating }"
              >
                ★
              </text>
            </view>
            <text class="rating-text">{{ analysisData.difficultyRating }}星</text>
          </view>
          <view class="rating-row">
            <text class="label">答题效果：</text>
            <view class="stars">
              <text 
                v-for="index in 5" 
                :key="index"
                class="star"
                :class="{ active: index <= analysisData.studentPerformance }"
              >
                ★
              </text>
            </view>
            <text class="rating-text">{{ analysisData.studentPerformance }}星</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="action-section">
          <button class="action-btn edit" @click="editAnalysis">
            <text class="btn-icon">✏️</text>
            <text class="btn-text">编辑</text>
          </button>
          <button class="action-btn delete" @click="deleteAnalysis">
            <text class="btn-icon">🗑️</text>
            <text class="btn-text">删除</text>
          </button>
        </view>
      </view>
      
      <!-- 无数据 -->
      <view v-else class="empty">
        <text>数据不存在</text>
      </view>
    </view>
    
    <!-- 图片放大查看组件 -->
    <ImageZoomViewer
      :visible="showImageZoom"
      :images="currentImages"
      :currentIndex="currentImageIndex"
      @close="closeImageZoom"
      @switch="switchImage"
    />
  </view>
</template>

<script>
import ImageZoomViewer from '@/components/ImageZoomViewer.vue'

export default {
  components: {
    ImageZoomViewer
  },
  data() {
    return {
      loading: true,
      analysisData: null,
      analysisId: '',
      showImageZoom: false,
      currentImages: [],
      currentImageIndex: 0
    }
  },
  
  onLoad(options) {
    if (options.id) {
      this.analysisId = options.id
      this.loadAnalysisDetail(options.id)
    } else {
      this.loading = false
      uni.showToast({
        title: '缺少必要参数',
        icon: 'none'
      })
    }
  },
  
  methods: {
    // 加载分析详情
    async loadAnalysisDetail(id) {
      try {
        const result = await uniCloud.callFunction({
          name: 'exam-analysis',
          data: {
            action: 'getDetail',
            data: { id }
          }
        })
        
        if (result.result.code === 0) {
          this.analysisData = result.result.data
        } else {
          uni.showToast({
            title: result.result.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载详情失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 打开图片放大查看
    openImageZoom(images, currentIndex) {
      if (!images || images.length === 0) {
        uni.showToast({
          title: '没有图片可预览',
          icon: 'none'
        })
        return
      }
      
      this.currentImages = images
      this.currentImageIndex = currentIndex
      this.showImageZoom = true
    },
    
    // 编辑分析
    editAnalysis() {
      uni.navigateTo({
        url: `/pages/exam-analysis/exam-analysis?id=${this.analysisId}`
      })
    },
    
    // 删除分析
    deleteAnalysis() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条试卷分析吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const userInfo = uni.getStorageSync('userInfo')
              const result = await uniCloud.callFunction({
                name: 'exam-analysis',
                data: {
                  action: 'delete',
                  data: {
                    id: this.analysisId,
                    userId: userInfo._id
                  }
                }
              })
              
              if (result.result.code === 0) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                setTimeout(() => {
                  uni.navigateBack()
                }, 1500)
              } else {
                uni.showToast({
                  title: result.result.message || '删除失败',
                  icon: 'none'
                })
              }
            } catch (error) {
              console.error('删除失败:', error)
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    // 查看学生详情
    viewStudentDetail() {
      if (this.analysisData && this.analysisData.studentId) {
        uni.navigateTo({
          url: `/pages/student-hours-detail/student-hours-detail?id=${this.analysisData.studentId}`
        })
      } else {
        uni.showToast({
          title: '学生信息不完整',
          icon: 'none'
        })
      }
    },

    // 查看用户详情
    viewUserDetail() {
      if (this.analysisData && this.analysisData.userId) {
        uni.showToast({
          title: '用户详情功能开发中',
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: '用户信息不完整',
          icon: 'none'
        })
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 预览图片
    previewImage(images, currentIndex) {
      if (!images || images.length === 0) {
        uni.showToast({
          title: '没有图片可预览',
          icon: 'none'
        })
        return
      }
      
      uni.previewImage({
        urls: images,
        current: currentIndex,
        loop: true,
        indicator: 'number'
      })
    },

    // 打开图片放大查看
    openImageZoom(images, index) {
      this.currentImages = images;
      this.currentImageIndex = index;
      this.showImageZoom = true;
    },

    // 关闭图片放大查看
    closeImageZoom() {
      this.showImageZoom = false;
      this.currentImages = [];
      this.currentImageIndex = 0;
    },

    // 切换图片
    switchImage(index) {
      this.currentImageIndex = index;
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.exam-analysis-detail-container {
  min-height: 100vh;
}

.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: var(--status-bar-height);
}

.back-btn {
  position: absolute;
  left: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.back-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.nav-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.detail-content {
  padding: 30rpx;
}

.section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  border-left: 8rpx solid #667eea;
  padding-left: 20rpx;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
  width: 150rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.value.clickable {
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
}

.value.clickable:active {
  color: #5a6fd8;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
}

.exam-image, .analysis-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
  border: 2rpx solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.exam-image:active, .analysis-image:active {
  transform: scale(0.95);
}

.analysis-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.stars {
  display: flex;
  gap: 5rpx;
  margin-right: 20rpx;
}

.star {
  font-size: 30rpx;
  color: #ddd;
}

.star.active {
  color: #ffd700;
}

.rating-text {
  font-size: 26rpx;
  color: #666;
}

.action-section {
  display: flex;
  gap: 30rpx;
  padding: 30rpx 30rpx 40rpx 30rpx;
  margin-top: 30rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  z-index: 1;
}

.action-btn.edit {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.action-btn.edit:active {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: scale(0.98);
}

.action-btn.delete {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.action-btn.delete:active {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  transform: scale(0.98);
}

.btn-icon {
  font-size: 32rpx;
  z-index: 2;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
  z-index: 2;
}
</style> 