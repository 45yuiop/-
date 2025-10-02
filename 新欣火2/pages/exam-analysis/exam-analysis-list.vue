<template>
  <view class="page-container">
    <view class="exam-analysis-list-container">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">试卷分析列表</view>
      </view>
      
      <!-- 筛选条件 -->
      <view class="filter-section">
        <view class="filter-row">
          <picker @change="onYearChange" :value="yearIndex" :range="yearList" class="filter-picker">
            <view class="picker-box">
              <text>{{ selectedYear || '选择年份' }}</text>
              <text class="arrow">></text>
            </view>
          </picker>
          
          <picker @change="onMonthChange" :value="monthIndex" :range="monthList" class="filter-picker">
            <view class="picker-box">
              <text>{{ selectedMonth || '选择月份' }}</text>
              <text class="arrow">></text>
            </view>
          </picker>
          
          <picker @change="onExamTypeChange" :value="examTypeIndex" :range="examTypeList" class="filter-picker">
            <view class="picker-box">
              <text>{{ selectedExamType || '选择类型' }}</text>
              <text class="arrow">></text>
            </view>
          </picker>
        </view>
      </view>
      
      <!-- 列表内容 -->
      <view class="list-container">
        <view v-if="loading" class="loading">
          <text>加载中...</text>
        </view>
        
        <view v-else-if="analysisList.length === 0" class="empty">
          <text>暂无数据</text>
        </view>
        
        <view v-else class="analysis-list">
          <view 
            v-for="item in analysisList" 
            :key="item._id"
            class="analysis-item"
            @click="viewDetail(item)"
          >
            <view class="item-header">
              <view class="item-title">
                {{ item.year }}年{{ item.month }} - {{ item.examType }}
              </view>
              <view class="item-time">
                {{ formatTime(item.createTime) }}
              </view>
            </view>
            
            <view class="item-student">
              <text class="student-info" @click.stop="viewStudentDetail(item)">
                {{ (item.grade || '未知年级') }} - {{ (item.studentName || '未知学生') }}
              </text>
            </view>
            
            <view class="item-content">
              <view class="content-row">
                <text class="label">考试难度：</text>
                <view class="stars">
                  <text 
                    v-for="index in 5" 
                    :key="index"
                    class="star"
                    :class="{ active: index <= item.difficultyRating }"
                  >
                    ★
                  </text>
                </view>
              </view>
              
              <view class="content-row">
                <text class="label">答题效果：</text>
                <view class="stars">
                  <text 
                    v-for="index in 5" 
                    :key="index"
                    class="star"
                    :class="{ active: index <= item.studentPerformance }"
                  >
                    ★
                  </text>
                </view>
              </view>
              
              <view v-if="item.analysisText" class="content-row">
                <text class="label">分析内容：</text>
                <text class="analysis-text">{{ item.analysisText.substring(0, 50) }}{{ item.analysisText.length > 50 ? '...' : '' }}</text>
              </view>
              
              <!-- 试卷图片预览 -->
              <view v-if="item.examImages && item.examImages.length > 0" class="content-row">
                <text class="label">试卷图片：</text>
                <view class="image-preview-list">
                  <view 
                    v-for="(image, index) in item.examImages.slice(0, 3)" 
                    :key="index"
                    class="image-preview-item"
                    @click.stop="openImageZoom(item.examImages, index)"
                  >
                    <image :src="image" class="preview-image" mode="aspectFill" />
                    <view v-if="index === 2 && item.examImages.length > 3" class="more-indicator">
                      <text>+{{ item.examImages.length - 3 }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            
            <view class="item-footer">
              <text class="user-name" @click.stop="viewUserDetail(item)">{{ item.userName || '未知用户' }}</text>
              <view class="action-buttons">
                <button class="action-btn edit" @click.stop="editAnalysis(item)">编辑</button>
                <button class="action-btn delete" @click.stop="deleteAnalysis(item)">删除</button>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 分页 -->
        <view v-if="total > pageSize" class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <text class="page-info">{{ currentPage }} / {{ totalPages }}</text>
          <button 
            class="page-btn" 
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </view>
      </view>
      
      <!-- 悬浮添加按钮 -->
      <view class="fab" @click="addAnalysis">
        <text class="fab-icon">+</text>
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
      // 筛选条件
      yearList: [],
      yearIndex: 0,
      selectedYear: '全部',
      
      monthList: ['全部', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthIndex: 0,
      selectedMonth: '全部',
      
      examTypeList: ['全部', '期中', '元调', '二调', '四调', '中考', '月考', '期末'],
      examTypeIndex: 0,
      selectedExamType: '全部',
      
      // 列表数据
      analysisList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      showImageZoom: false,
      currentImages: [],
      currentImageIndex: 0
    }
  },
  
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  
  onLoad() {
    // 检查用户登录状态
    const userInfo = uni.getStorageSync('userInfo')
    console.log('exam-analysis-list onLoad - userInfo:', userInfo)
    
    this.initYearList()
    // 设置默认筛选条件，确保能显示所有数据
    this.$nextTick(() => {
      this.setDefaultFilters()
      this.loadAnalysisList()
    })
  },
  
  onPullDownRefresh() {
    this.loadAnalysisList()
  },
  
  methods: {
    // 初始化年份列表
    initYearList() {
      this.yearList = ['全部'] // 添加"全部"选项
      const currentYear = new Date().getFullYear()
      for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        this.yearList.push(i + '年')
      }
    },
    
    // 设置默认筛选条件
    setDefaultFilters() {
      // 强制设置默认值
      this.$set(this, 'selectedYear', '全部')
      this.$set(this, 'yearIndex', 0)
      
      this.$set(this, 'selectedMonth', '全部')
      this.$set(this, 'monthIndex', 0)
      
      this.$set(this, 'selectedExamType', '全部')
      this.$set(this, 'examTypeIndex', 0)
      
      console.log('setDefaultFilters - 设置完成:', {
        selectedYear: this.selectedYear,
        selectedMonth: this.selectedMonth,
        selectedExamType: this.selectedExamType,
        yearIndex: this.yearIndex,
        monthIndex: this.monthIndex,
        examTypeIndex: this.examTypeIndex
      })
    },
    
    // 年份选择
    onYearChange(e) {
      this.yearIndex = e.detail.value
      this.selectedYear = this.yearList[this.yearIndex]
      console.log('onYearChange - 选择年份:', { yearIndex: this.yearIndex, selectedYear: this.selectedYear })
      // 选择后自动加载数据
      this.currentPage = 1
      this.loadAnalysisList()
    },
    
    // 月份选择
    onMonthChange(e) {
      this.monthIndex = e.detail.value
      this.selectedMonth = this.monthList[this.monthIndex]
      console.log('onMonthChange - 选择月份:', { monthIndex: this.monthIndex, selectedMonth: this.selectedMonth })
      // 选择后自动加载数据
      this.currentPage = 1
      this.loadAnalysisList()
    },
    
    // 考试类型选择
    onExamTypeChange(e) {
      this.examTypeIndex = e.detail.value
      this.selectedExamType = this.examTypeList[this.examTypeIndex]
      console.log('onExamTypeChange - 选择考试类型:', { examTypeIndex: this.examTypeIndex, selectedExamType: this.selectedExamType })
      // 选择后自动加载数据
      this.currentPage = 1
      this.loadAnalysisList()
    },
    
    // 重置筛选条件
    resetFilter() {
      this.selectedYear = '全部'
      this.selectedMonth = '全部'
      this.selectedExamType = '全部'
      this.yearIndex = 0
      this.monthIndex = 0
      this.examTypeIndex = 0
      this.currentPage = 1
      this.loadAnalysisList()
    },
    
    // 搜索分析
    searchAnalysis() {
      this.currentPage = 1
      this.loadAnalysisList()
    },
    
    // 加载分析列表
    async loadAnalysisList() {
      this.loading = true
      
      try {
        const userInfo = uni.getStorageSync('userInfo')
        console.log('loadAnalysisList - userInfo:', userInfo)
        if (!userInfo) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        // 只在有值且不是"全部"时才传递筛选条件
        const params = {
          userId: userInfo._id,
          userRole: userInfo.role,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        if (this.selectedYear && this.selectedYear !== '全部') params.year = this.selectedYear
        if (this.selectedMonth && this.selectedMonth !== '全部') params.month = this.selectedMonth
        if (this.selectedExamType && this.selectedExamType !== '全部') params.examType = this.selectedExamType
        
        console.log('loadAnalysisList - 发送参数:', params)
        
        const result = await uniCloud.callFunction({
          name: 'exam-analysis',
          data: {
            action: 'getList',
            data: params
          }
        })
        
        console.log('loadAnalysisList - 返回结果:', result)
        
        if (result.result.code === 0) {
          this.analysisList = result.result.data.list
          this.total = result.result.data.total
          console.log('loadAnalysisList - 设置数据:', { list: this.analysisList.length, total: this.total })
        } else {
          console.error('loadAnalysisList - 返回错误:', result.result)
          uni.showToast({
            title: result.result.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    
    // 查看详情
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/exam-analysis/exam-analysis-detail?id=${item._id}`
      })
    },
    
    // 编辑分析
    editAnalysis(item) {
      uni.navigateTo({
        url: `/pages/exam-analysis/exam-analysis?id=${item._id}`
      })
    },
    
    // 删除分析
    deleteAnalysis(item) {
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
                    id: item._id,
                    userId: userInfo._id,
                    userRole: userInfo.role
                  }
                }
              })
              
              if (result.result.code === 0) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                this.loadAnalysisList()
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
    
    // 添加分析
    addAnalysis() {
      uni.navigateTo({
        url: '/pages/exam-analysis/exam-analysis'
      })
    },
    
    // 切换页面
    changePage(page) {
      this.currentPage = page
      this.loadAnalysisList()
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 查看学生详情
    viewStudentDetail(item) {
      if (item.studentId) {
        uni.navigateTo({
          url: `/pages/student-hours-detail/student-hours-detail?id=${item.studentId}`
        })
      } else {
        uni.showToast({
          title: '学生信息不完整',
          icon: 'none'
        })
      }
    },

    // 查看用户详情
    viewUserDetail(item) {
      if (item.userId) {
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

    // 关闭图片放大查看
    closeImageZoom() {
      this.showImageZoom = false
      this.currentImages = []
      this.currentImageIndex = 0
    },

    // 切换图片
    switchImage(index) {
      this.currentImageIndex = index
    }

  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.exam-analysis-list-container {
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

.filter-section {
  background: white;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.filter-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.filter-picker {
  flex: 1;
}

.picker-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.arrow {
  color: #999;
}

.filter-buttons {
  display: flex;
  gap: 20rpx;
}

.filter-btn {
  flex: 1;
  height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  border: 2rpx solid #e0e0e0;
  background: white;
  color: #666;
}

.filter-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.list-container {
  padding: 0 30rpx;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.analysis-list {
  margin-bottom: 30rpx;
}

.analysis-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.item-student {
  margin-bottom: 15rpx;
}

.student-info {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

.student-info:active {
  color: #5a6fd8;
}

.item-content {
  margin-bottom: 20rpx;
}

.content-row {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.stars {
  display: flex;
  gap: 5rpx;
}

.star {
  font-size: 24rpx;
  color: #ddd;
}

.star.active {
  color: #ffd700;
}

.analysis-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

/* 图片预览样式 */
.image-preview-list {
  display: flex;
  gap: 10rpx;
  flex: 1;
}

.image-preview-item {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  overflow: hidden;
  border: 2rpx solid #e0e0e0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.preview-image:active {
  transform: scale(0.95);
}

.more-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-indicator text {
  color: white;
  font-size: 20rpx;
  font-weight: bold;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.user-name {
  font-size: 24rpx;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
}

.user-name:active {
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  padding: 10rpx 20rpx;
  border-radius: 15rpx;
  font-size: 24rpx;
  border: none;
}

.action-btn.edit {
  background: #4CAF50;
  color: white;
}

.action-btn.delete {
  background: #f44336;
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30rpx;
  padding: 30rpx 0;
}

.page-btn {
  padding: 15rpx 30rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  border: 2rpx solid #e0e0e0;
  background: white;
  color: #666;
}

.page-btn:disabled {
  opacity: 0.5;
}

.page-info {
  font-size: 28rpx;
  color: #666;
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
}

.fab-icon {
  color: white;
  font-size: 50rpx;
  font-weight: bold;
}


</style> 