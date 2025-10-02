<template>
  <view class="page-container">
    <view class="exam-analysis-container">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">试卷分析</view>
      </view>
      
      <!-- 主要内容区域 -->
      <view class="content">
        <!-- 基本信息选择 -->
        <view class="section">
          <view class="section-title">基本信息</view>
          
          <!-- 年级选择 -->
          <view class="form-item">
            <text class="label">年级</text>
            <picker @change="onGradeChange" :value="gradeIndex" :range="gradeList">
              <view class="picker-box">
                <text>{{ selectedGrade }}</text>
                <text class="arrow">></text>
              </view>
            </picker>
          </view>
          
          <!-- 学生选择 -->
          <view class="form-item">
            <text class="label">学生</text>
            <picker @change="onStudentChange" :value="studentIndex" :range="studentList" range-key="studentName">
              <view class="picker-box">
                <text>{{ selectedStudent ? selectedStudent.studentName : '请选择学生' }}</text>
                <text class="arrow">></text>
              </view>
            </picker>
          </view>
          
          <!-- 年份选择 -->
          <view class="form-item">
            <text class="label">年份</text>
            <picker @change="onYearChange" :value="yearIndex" :range="yearList">
              <view class="picker-box">
                <text>{{ selectedYear }}</text>
                <text class="arrow">></text>
              </view>
            </picker>
          </view>
          
          <!-- 月份选择 -->
          <view class="form-item">
            <text class="label">月份</text>
            <picker @change="onMonthChange" :value="monthIndex" :range="monthList">
              <view class="picker-box">
                <text>{{ selectedMonth }}</text>
                <text class="arrow">></text>
              </view>
            </picker>
          </view>
          
          <!-- 考试类型选择 -->
          <view class="form-item">
            <text class="label">考试类型</text>
            <view class="exam-type-container">
              <view class="exam-type-list">
                <view 
                  v-for="(type, index) in examTypes" 
                  :key="index"
                  class="exam-type-item"
                  :class="{ active: selectedExamType === type }"
                  @click="selectExamType(type)"
                >
                  {{ type }}
                </view>
              </view>
              <view class="custom-exam-type">
                <input 
                  v-model="customExamType" 
                  placeholder="自定义考试类型"
                  class="custom-input"
                  @input="onCustomTypeInput"
                />
              </view>
            </view>
          </view>
        </view>
        
        <!-- 试卷上传 -->
        <view class="section">
          <view class="section-title">试卷上传</view>
          <view class="upload-container">
            <view class="upload-list">
              <!-- 显示云存储的图片 -->
              <view 
                v-for="(fileID, index) in examImageFileIDs" 
                :key="index"
                class="upload-item"
              >
                <image :src="fileID" class="upload-image" mode="aspectFit" @click="openImageZoom(examImageFileIDs, index)" />
                <view class="delete-btn" @click="deleteCloudExamImage(index)">×</view>
              </view>
              <!-- 显示本地新选择的图片 -->
              <view 
                v-for="(image, index) in examImages" 
                :key="index + examImageFileIDs.length"
                class="upload-item"
              >
                <image :src="image" class="upload-image" mode="aspectFit" @click="openImageZoom(examImages, index)" />
                <view class="delete-btn" @click="deleteLocalExamImage(index)">×</view>
              </view>
              <view v-if="(examImageFileIDs.length + examImages.length) < 5" class="upload-btn" @click="chooseImage">
                <text class="plus">+</text>
                <text class="upload-text">上传试卷</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 试卷分析 -->
        <view class="section">
          <view class="section-title">试卷分析</view>
          <view class="analysis-container">
            <textarea 
              v-model="analysisText"
              placeholder="请输入试卷分析内容，支持粘贴文本..."
              class="analysis-textarea"
              :maxlength="2000"
              show-confirm-bar="false"
            />
            <view class="analysis-upload">
              <view class="upload-list">
                <!-- 显示云存储的分析图片 -->
                <view 
                  v-for="(fileID, index) in analysisImageFileIDs" 
                  :key="index"
                  class="upload-item"
                >
                  <image :src="fileID" class="upload-image" mode="aspectFit" @click="openImageZoom(analysisImageFileIDs, index)" />
                  <view class="delete-btn" @click="deleteCloudAnalysisImage(index)">×</view>
                </view>
                <!-- 显示本地新选择的分析图片 -->
                <view 
                  v-for="(image, index) in analysisImages" 
                  :key="index + analysisImageFileIDs.length"
                  class="upload-item"
                >
                  <image :src="image" class="upload-image" mode="aspectFit" @click="openImageZoom(analysisImages, index)" />
                  <view class="delete-btn" @click="deleteLocalAnalysisImage(index)">×</view>
                </view>
                <view v-if="(analysisImageFileIDs.length + analysisImages.length) < 3" class="upload-btn" @click="chooseAnalysisImage">
                  <text class="plus">+</text>
                  <text class="upload-text">上传分析图片</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 难度评分 -->
        <view class="section">
          <view class="section-title">考试难度</view>
          <view class="rating-container">
            <view class="stars">
              <view 
                v-for="index in 5" 
                :key="index"
                class="star"
                :class="{ active: index <= difficultyRating }"
                @click="setDifficultyRating(index)"
              >
                ★
              </view>
            </view>
            <text class="rating-text"></text>
          </view>
        </view>
        
        <!-- 学生答题效果 -->
        <view class="section">
          <view class="section-title">学生答题效果</view>
          <view class="rating-container">
            <view class="stars">
              <view 
                v-for="index in 5" 
                :key="index"
                class="star"
                :class="{ active: index <= studentPerformance }"
                @click="setStudentPerformance(index)"
              >
                ★
              </view>
            </view>
            <text class="rating-text"></text>
          </view>
        </view>
        
            <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="submitAnalysis">{{ isEdit ? '更新分析' : '提交分析' }}</button>
      </view>
      
      <!-- 查看列表按钮 -->
      <view class="list-section">
        <button class="list-btn" @click="goToList">查看分析列表</button>
      </view>
      
      

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
      // 年级相关
      gradeList: [],
      gradeIndex: 0,
      selectedGrade: '',
      
      // 学生相关
      studentList: [],
      studentIndex: 0,
      selectedStudent: null,
      
      // 年份相关
      yearList: [],
      yearIndex: 0,
      selectedYear: '',
      
      // 月份相关
      monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthIndex: 0,
      selectedMonth: '',
      
      // 考试类型
      examTypes: ['期中', '元调', '二调', '四调', '中考', '月考', '期末'],
      selectedExamType: '',
      customExamType: '',
      
      // 试卷图片 - 分别存储云存储文件ID和本地图片路径
      examImages: [], // 本地新选择的图片路径
      examImageFileIDs: [], // 云存储的文件ID
      
      // 分析内容
      analysisText: '',
      analysisImages: [], // 本地新选择的图片路径
      analysisImageFileIDs: [], // 云存储的文件ID
      
      // 评分
      difficultyRating: 0,
      studentPerformance: 0,
      
      // 编辑模式
      isEdit: false,
      editId: '',
      
      // 图片放大查看
      showImageZoom: false,
      currentImages: [],
      currentImageIndex: 0
    }
  },
  
  onLoad(options) {
    try {
      console.log('试卷分析页面加载开始')
      
      // 检查用户登录状态
      const userInfo = uni.getStorageSync('userInfo')
      console.log('onLoad - userInfo:', userInfo)
      
      this.initYearList()
      this.initDefaultValues()
      this.loadGradeList()
      
      // 检查是否为编辑模式
      if (options.id) {
        this.isEdit = true
        this.editId = options.id
        // 延迟加载详情，确保年份列表已初始化
        setTimeout(() => {
          this.loadAnalysisDetail(options.id)
        }, 100)
      }
      console.log('试卷分析页面加载完成')
    } catch (error) {
      console.error('试卷分析页面加载失败:', error)
      uni.showToast({
        title: '页面加载失败',
        icon: 'none'
      })
    }
  },
  
  methods: {
    // 初始化年份列表
    initYearList() {
      try {
        console.log('初始化年份列表')
        const currentYear = new Date().getFullYear()
        for (let i = currentYear - 5; i <= currentYear + 1; i++) {
          this.yearList.push(i + '年')
        }
        this.selectedYear = this.yearList[0]
        console.log('年份列表初始化完成:', this.yearList)
      } catch (error) {
        console.error('初始化年份列表失败:', error)
      }
    },
    
    // 初始化默认值
    initDefaultValues() {
      try {
        console.log('初始化默认值')
        const currentMonth = new Date().getMonth()
        this.monthIndex = currentMonth
        this.selectedMonth = this.monthList[currentMonth]
        console.log('默认值初始化完成:', { monthIndex: this.monthIndex, selectedMonth: this.selectedMonth })
      } catch (error) {
        console.error('初始化默认值失败:', error)
      }
    },
    
    // 年级选择
    onGradeChange(e) {
      this.gradeIndex = e.detail.value
      this.selectedGrade = this.gradeList[this.gradeIndex]
      this.loadStudentsByGrade()
    },
    
    // 学生选择
    onStudentChange(e) {
      this.studentIndex = e.detail.value
      this.selectedStudent = this.studentList[this.studentIndex]
    },
    
    // 根据年级加载学生列表
    async loadStudentsByGrade() {
      if (!this.selectedGrade) return
      
      try {
        const userInfo = uni.getStorageSync('userInfo')
        console.log('loadStudentsByGrade - userInfo:', userInfo)
        if (!userInfo) {
          uni.showToast({ title: '请先登录', icon: 'none' })
          return
        }
        
        const result = await uniCloud.callFunction({
          name: 'student-hours',
          data: {
            action: 'getMyClassStudentsByType',
            teacherId: userInfo._id
          }
        })
        
        if (result.result.code === 200) {
          const allStudents = [
            ...result.result.data.classStudents,
            ...result.result.data.oneToOneStudents
          ]
          
          // 筛选指定年级的所有学生（包括一对一、班课、托产生）
          this.studentList = allStudents.filter(student => 
            student.grade === this.selectedGrade
          )
          
          // 重置学生选择
          this.selectedStudent = null
          this.studentIndex = 0
          
          console.log('加载学生列表完成:', this.studentList)
        } else {
          uni.showToast({ title: result.result.message || '加载学生失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载学生列表失败:', error)
        uni.showToast({ title: '加载学生失败，请重试', icon: 'none' })
      }
    },
    
    // 加载年级列表
    async loadGradeList() {
      try {
        const userInfo = uni.getStorageSync('userInfo')
        console.log('loadGradeList - userInfo:', userInfo)
        if (!userInfo) {
          uni.showToast({ title: '请先登录', icon: 'none' })
          return
        }
        
        const result = await uniCloud.callFunction({
          name: 'student-hours',
          data: {
            action: 'getMyClassStudentsByType',
            teacherId: userInfo._id
          }
        })
        
        if (result.result.code === 200) {
          const allStudents = [
            ...result.result.data.classStudents,
            ...result.result.data.oneToOneStudents
          ]
          
          // 获取所有年级并去重
          const grades = [...new Set(allStudents.map(student => student.grade).filter(Boolean))]
          this.gradeList = grades.sort()
          
          if (this.gradeList.length > 0) {
            this.selectedGrade = this.gradeList[0]
            this.gradeIndex = 0
            // 加载第一个年级的学生
            await this.loadStudentsByGrade()
          }
          
          console.log('加载年级列表完成:', this.gradeList)
        } else {
          uni.showToast({ title: result.result.message || '加载年级失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载年级列表失败:', error)
        uni.showToast({ title: '加载年级失败，请重试', icon: 'none' })
      }
    },
    
    // 年份选择
    onYearChange(e) {
      this.yearIndex = e.detail.value
      this.selectedYear = this.yearList[this.yearIndex]
    },
    
    // 月份选择
    onMonthChange(e) {
      this.monthIndex = e.detail.value
      this.selectedMonth = this.monthList[this.monthIndex]
    },
    
    // 选择考试类型
    selectExamType(type) {
      this.selectedExamType = type
      this.customExamType = ''
    },
    
    // 自定义考试类型输入
    onCustomTypeInput(e) {
      this.customExamType = e.detail.value
      this.selectedExamType = ''
    },
    
    // 选择试卷图片
    chooseImage() {
      uni.chooseImage({
        count: 5 - this.examImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.examImages = [...this.examImages, ...res.tempFilePaths]
        }
      })
    },
    
    // 删除试卷图片（保留原有方法以兼容）
    deleteImage(index) {
      this.examImages.splice(index, 1)
    },
    
    // 选择分析图片
    chooseAnalysisImage() {
      uni.chooseImage({
        count: 3 - this.analysisImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.analysisImages = [...this.analysisImages, ...res.tempFilePaths]
        }
      })
    },
    
    // 删除分析图片（保留原有方法以兼容）
    deleteAnalysisImage(index) {
      this.analysisImages.splice(index, 1)
    },
    
    // 设置难度评分
    setDifficultyRating(rating) {
      this.difficultyRating = rating
    },

    // 设置学生答题效果
    setStudentPerformance(rating) {
      this.studentPerformance = rating
    },
    
    // 提交分析
    async submitAnalysis() {
      // 验证必填字段
      if (!this.selectedYear || !this.selectedMonth || !this.selectedExamType && !this.customExamType) {
        uni.showToast({
          title: '请填写完整的基本信息',
          icon: 'none'
        })
        return
      }
      
      if (!this.selectedStudent || !this.selectedGrade) {
        uni.showToast({
          title: '请选择年级和学生',
          icon: 'none'
        })
        return
      }
      
             if ((!this.examImages || this.examImages.length === 0) && (!this.examImageFileIDs || this.examImageFileIDs.length === 0)) {
        uni.showToast({
          title: '请上传试卷图片',
          icon: 'none'
        })
        return
      }
      
             if ((!this.analysisText || this.analysisText.trim() === '') && (!this.analysisImages || this.analysisImages.length === 0) && (!this.analysisImageFileIDs || this.analysisImageFileIDs.length === 0)) {
        uni.showToast({
          title: '请填写试卷分析或上传分析图片',
          icon: 'none'
        })
        return
      }
      
      if (!this.difficultyRating || this.difficultyRating === 0) {
        uni.showToast({
          title: '请选择考试难度',
          icon: 'none'
        })
        return
      }
      
      if (!this.studentPerformance || this.studentPerformance === 0) {
        uni.showToast({
          title: '请选择学生答题效果',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '正在提交...'
      })
      
      try {
        console.log('开始上传图片到云存储')
        
        // 上传试卷图片到云存储（只上传本地新选择的图片）
        const examImageFileIDs = [...this.examImageFileIDs] // 保留原有的云存储文件ID
        for (let i = 0; i < this.examImages.length; i++) {
          const imagePath = this.examImages[i]
          const fileName = `exam_images/${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}.jpg`
          
          try {
            const uploadResult = await uniCloud.uploadFile({
              filePath: imagePath,
              cloudPath: fileName
            })
            examImageFileIDs.push(uploadResult.fileID)
            console.log(`试卷图片 ${i + 1} 上传成功:`, uploadResult.fileID)
          } catch (uploadError) {
            console.error(`试卷图片 ${i + 1} 上传失败:`, uploadError)
            // 检查是否是域名问题
            if (uploadError.message && uploadError.message.includes('domain list')) {
              throw new Error('图片上传失败：请检查微信小程序域名配置。请在微信开发者工具中配置云存储域名。')
            } else {
              throw new Error(`试卷图片 ${i + 1} 上传失败`)
            }
          }
        }
        
        // 上传分析图片到云存储（只上传本地新选择的图片）
        const analysisImageFileIDs = [...this.analysisImageFileIDs] // 保留原有的云存储文件ID
        for (let i = 0; i < this.analysisImages.length; i++) {
          const imagePath = this.analysisImages[i]
          const fileName = `analysis_images/${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}.jpg`
          
          try {
            const uploadResult = await uniCloud.uploadFile({
              filePath: imagePath,
              cloudPath: fileName
            })
            analysisImageFileIDs.push(uploadResult.fileID)
            console.log(`分析图片 ${i + 1} 上传成功:`, uploadResult.fileID)
          } catch (uploadError) {
            console.error(`分析图片 ${i + 1} 上传失败:`, uploadError)
            // 检查是否是域名问题
            if (uploadError.message && uploadError.message.includes('domain list')) {
              throw new Error('图片上传失败：请检查微信小程序域名配置。请在微信开发者工具中配置云存储域名。')
            } else {
              throw new Error(`分析图片 ${i + 1} 上传失败`)
            }
          }
        }
        
        console.log('所有图片上传完成，开始调用云函数')
        
        // 获取用户信息
        const userInfo = uni.getStorageSync('userInfo')
        if (!userInfo) {
          throw new Error('用户信息不存在')
        }
        
        const result = await uniCloud.callFunction({
          name: 'exam-analysis',
          data: {
            action: this.isEdit ? 'update' : 'save',
            data: {
              ...(this.isEdit && { id: this.editId }),
              year: this.selectedYear,
              month: this.selectedMonth,
              examType: this.selectedExamType || this.customExamType,
              examImages: examImageFileIDs, // 使用云存储文件ID
              analysisText: this.analysisText,
              analysisImages: analysisImageFileIDs, // 使用云存储文件ID
              difficultyRating: this.difficultyRating,
              studentPerformance: this.studentPerformance,
              studentId: this.selectedStudent._id,
              studentName: this.selectedStudent.studentName,
              grade: this.selectedGrade,
              userId: userInfo._id,
              userRole: userInfo.role,
              userName: userInfo.teacherName || userInfo.username || '未知用户'
            }
          }
        })
        
        console.log('云函数调用结果:', result)
        uni.hideLoading()
        
        if (result.result.code === 0) {
          uni.showToast({
            title: this.isEdit ? '更新成功' : '提交成功',
            icon: 'success'
          })
          
          if (this.isEdit) {
            // 编辑模式下返回上一页
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          } else {
            // 重置表单
            this.resetForm()
          }
        } else {
          console.error('提交失败:', result.result.message)
          uni.showToast({
            title: result.result.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('提交失败:', error)
        
        // 如果是域名配置问题，显示更详细的提示
        if (error.message && error.message.includes('域名配置')) {
          uni.showModal({
            title: '配置提示',
            content: '图片上传失败，需要在微信开发者工具中配置云存储域名。\n\n配置步骤：\n1. 点击右上角"详情"\n2. 选择"域名信息"\n3. 在"uploadFile合法域名"中添加云存储域名\n4. 重新编译项目',
            showCancel: false,
            confirmText: '我知道了'
          })
        } else {
          uni.showToast({
            title: error.message || '提交失败，请重试',
            icon: 'none'
          })
        }
      }
    },
    
    // 重置表单
    resetForm() {
      this.selectedYear = this.yearList[0]
      this.yearIndex = 0
      this.selectedMonth = this.monthList[new Date().getMonth()]
      this.monthIndex = new Date().getMonth()
      this.selectedExamType = ''
      this.customExamType = ''
      this.examImages = []
      this.examImageFileIDs = [] // 重置云存储文件ID
      this.analysisText = ''
      this.analysisImages = []
      this.analysisImageFileIDs = [] // 重置云存储文件ID
      this.difficultyRating = 0
      this.studentPerformance = 0
      this.selectedGrade = this.gradeList[0] || ''
      this.gradeIndex = 0
      this.selectedStudent = null
      this.studentIndex = 0
      this.studentList = []
      this.isEdit = false
      this.editId = ''
    },
    
    // 加载分析详情
    async loadAnalysisDetail(id) {
      try {
        console.log('开始加载分析详情:', id)
        const result = await uniCloud.callFunction({
          name: 'exam-analysis',
          data: {
            action: 'getDetail',
            data: { id }
          }
        })
        
        console.log('加载详情结果:', result)
        
        if (result.result.code === 0) {
          const data = result.result.data
          console.log('详情数据:', data)
          
          this.selectedYear = data.year
          const yearIndex = this.yearList.indexOf(data.year)
          this.yearIndex = yearIndex !== -1 ? yearIndex : 0
          
          this.selectedMonth = data.month
          const monthIndex = this.monthList.indexOf(data.month)
          this.monthIndex = monthIndex !== -1 ? monthIndex : 0
          
          // 如果找不到对应的索引，使用默认值
          if (yearIndex === -1) {
            this.selectedYear = this.yearList[0]
          }
          if (monthIndex === -1) {
            this.selectedMonth = this.monthList[0]
          }
          
          // 检查考试类型是否在预设列表中
          const examTypeIndex = this.examTypes.indexOf(data.examType)
          if (examTypeIndex !== -1) {
            this.selectedExamType = data.examType
            this.customExamType = ''
          } else {
            this.selectedExamType = ''
            this.customExamType = data.examType
          }
                     // 处理试卷图片 - 如果是云存储文件ID，直接使用；如果是本地路径，清空（编辑时重新选择）
           if (data.examImages && Array.isArray(data.examImages)) {
             // 检查是否为云存储文件ID（以cloud://开头）
             const cloudImages = data.examImages.filter(img => typeof img === 'string' && img.startsWith('cloud://'))
             const localImages = data.examImages.filter(img => typeof img === 'string' && !img.startsWith('cloud://'))
             
             this.examImageFileIDs = cloudImages
             this.examImages = [] // 编辑时清空本地图片，需要重新选择
           } else {
             this.examImageFileIDs = []
             this.examImages = []
           }
          this.analysisText = data.analysisText || ''
                     // 处理分析图片 - 如果是云存储文件ID，直接使用；如果是本地路径，清空（编辑时重新选择）
           if (data.analysisImages && Array.isArray(data.analysisImages)) {
             // 检查是否为云存储文件ID（以cloud://开头）
             const cloudImages = data.analysisImages.filter(img => typeof img === 'string' && img.startsWith('cloud://'))
             const localImages = data.analysisImages.filter(img => typeof img === 'string' && !img.startsWith('cloud://'))
             
             this.analysisImageFileIDs = cloudImages
             this.analysisImages = [] // 编辑时清空本地图片，需要重新选择
           } else {
             this.analysisImageFileIDs = []
             this.analysisImages = []
           }
          this.difficultyRating = data.difficultyRating
          this.studentPerformance = data.studentPerformance
          
          // 设置年级和学生信息
          if (data.grade) {
            this.selectedGrade = data.grade
            const gradeIndex = this.gradeList.indexOf(data.grade)
            this.gradeIndex = gradeIndex !== -1 ? gradeIndex : 0
          }
          
          if (data.studentId && data.studentName) {
            // 需要重新加载学生列表来设置选中的学生
            await this.loadStudentsByGrade()
            const studentIndex = this.studentList.findIndex(student => student._id === data.studentId)
            if (studentIndex !== -1) {
              this.selectedStudent = this.studentList[studentIndex]
              this.studentIndex = studentIndex
            }
          }
          
          console.log('详情加载完成')
        } else {
          console.error('加载详情失败:', result.result.message)
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
      }
    },
    
    // 跳转到列表页面
    goToList() {
      uni.navigateTo({
        url: '/pages/exam-analysis/exam-analysis-list'
      })
    },
    

    
    // 返回上一页
    goBack() {
      uni.navigateBack()
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
    },
    
    // 删除云存储的试卷图片
    deleteCloudExamImage(index) {
      const fileID = this.examImageFileIDs[index];
      if (fileID) {
        uniCloud.deleteFile({
          fileList: [fileID]
        }).then(() => {
          this.examImageFileIDs.splice(index, 1);
          uni.showToast({
            title: '图片删除成功',
            icon: 'success'
          });
        }).catch(err => {
          console.error('删除云存储图片失败:', err);
          uni.showToast({
            title: '图片删除失败',
            icon: 'none'
          });
        });
      }
    },

    // 删除本地新选择的试卷图片
    deleteLocalExamImage(index) {
      this.examImages.splice(index, 1);
      uni.showToast({
        title: '图片删除成功',
        icon: 'success'
      });
    },
    
         // 删除云存储的分析图片
     deleteCloudAnalysisImage(index) {
       const fileID = this.analysisImageFileIDs[index];
       if (fileID) {
         uniCloud.deleteFile({
           fileList: [fileID]
         }).then(() => {
           this.analysisImageFileIDs.splice(index, 1);
           uni.showToast({
             title: '图片删除成功',
             icon: 'success'
           });
         }).catch(err => {
           console.error('删除云存储图片失败:', err);
           uni.showToast({
             title: '图片删除失败',
             icon: 'none'
           });
         });
       }
     },

     // 删除本地新选择的分析图片
     deleteLocalAnalysisImage(index) {
       this.analysisImages.splice(index, 1);
       uni.showToast({
         title: '图片删除成功',
         icon: 'success'
       });
     },
    
    // 将图片转换为base64格式
    imageToBase64(filePath) {
      return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath: filePath,
          encoding: 'base64',
          success: (res) => {
            // 根据文件扩展名确定MIME类型
            const ext = filePath.split('.').pop().toLowerCase()
            let mimeType = 'image/jpeg'
            if (ext === 'png') mimeType = 'image/png'
            else if (ext === 'gif') mimeType = 'image/gif'
            else if (ext === 'webp') mimeType = 'image/webp'
            
            const base64 = `data:${mimeType};base64,${res.data}`
            resolve(base64)
          },
          fail: (err) => {
            console.error('读取文件失败:', err)
            reject(err)
          }
        })
      })
    },
    
    // 调试用户信息

  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.exam-analysis-container {
  min-height: 100vh;
}

.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: calc(var(--status-bar-height) + 15rpx);
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

.content {
  padding: 50rpx 30rpx 30rpx 30rpx;
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

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.picker-box {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 28rpx;
}

.arrow {
  margin-left: 10rpx;
  color: #999;
}

.exam-type-container {
  width: 100%;
}

.exam-type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.exam-type-item {
  padding: 15rpx 25rpx;
  background: #f8f9fa;
  border-radius: 25rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.exam-type-item.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.custom-input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #fafafa;
}

.upload-container {
  width: 100%;
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
  border: 2rpx solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.upload-image:active {
  transform: scale(0.95);
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ccc;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.plus {
  font-size: 60rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.analysis-container {
  width: 100%;
}

.analysis-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #fafafa;
  margin-bottom: 20rpx;
}

.analysis-upload {
  width: 100%;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.stars {
  display: flex;
  gap: 10rpx;
}

.star {
  font-size: 50rpx;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s;
}

.star.active {
  color: #ffd700;
}

.rating-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.submit-section {
  margin-top: 50rpx;
  padding: 0 30rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:active {
  transform: scale(0.98);
}

.list-section {
  margin-top: 30rpx;
  padding: 0 30rpx;
}

.list-btn {
  width: 100%;
  height: 80rpx;
  background: #f8f9fa;
  color: #667eea;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: 2rpx solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-btn:active {
  transform: scale(0.98);
}

.debug-section {
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.debug-btn {
  width: 100%;
  height: 60rpx;
  background: #ff6b6b;
  color: white;
  border-radius: 30rpx;
  font-size: 26rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-btn:active {
  transform: scale(0.98);
}
</style>
