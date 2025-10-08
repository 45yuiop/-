<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="page-header animated-card">
      <view class="back-button" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="page-title">班级管理</text>
    </view>

    <!-- 搜索和筛选区域 -->
    <view class="search-filter-section animated-card">
      <!-- 搜索框 -->
      <view class="search-container">
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="🔍 搜索班级名称" 
          @input="onSearchInput"
        />
        <text class="search-icon">🔍</text>
      </view>
      
      <!-- 筛选器 -->
      <view class="filter-container">
        <!-- 年级筛选 -->
        <view class="filter-group">
          <text class="filter-label">年级：</text>
          <picker 
            class="filter-picker" 
            :value="gradeIndex" 
            :range="gradeOptions" 
            @change="onGradeChange"
          >
            <view class="picker-display">
              <text class="picker-text">{{ gradeOptions[gradeIndex] }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <!-- 科目筛选 -->
        <view class="filter-group">
          <text class="filter-label">科目：</text>
          <picker 
            class="filter-picker" 
            :value="subjectIndex" 
            :range="subjectOptions" 
            @change="onSubjectChange"
          >
            <view class="picker-display">
              <text class="picker-text">{{ subjectOptions[subjectIndex] }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
      </view>
    </view>

    <!-- 班级列表 -->
    <view class="class-list">
      <!-- 无结果提示 -->
      <view v-if="filteredClassList.length === 0" class="no-result-tip">
        <text class="no-result-text">没有找到符合条件的班级</text>
      </view>
      
      <view 
        class="class-item animated-card" 
        v-for="(item, index) in filteredClassList" 
        :key="item._id"
        @click="openClassDetail(item)"
      >
        <view class="class-header">
          <view class="class-badge">
            <text class="class-badge-text">班</text>
          </view>
          <view class="class-info-main">
            <text class="class-name">{{ item.className || item.class_name || '未命名班级' }}</text>
            <text class="class-grade-badge" v-if="item.grade">{{ item.grade }}</text>
          </view>
          <view class="student-count-badge">
            <text class="count-text">{{ item.students ? item.students.length : 0 }}人</text>
          </view>
        </view>
        <view class="class-details">
          <view class="detail-row">
            <text class="detail-label">班主任：</text>
            <text class="detail-value" v-if="item.teachers && item.teachers.length > 0">
              {{ getTeacherNames(item.teachers) }}
            </text>
            <text class="detail-value empty-value" v-else>未设置</text>
          </view>
        </view>
        <view class="class-actions">
          <text class="delete-btn" @click.stop="deleteClass(item)">删除</text>
        </view>
      </view>
    </view>

    <!-- 新建班级弹窗 -->
    <view class="modal" v-if="showAddClassModalFlag">
      <view class="modal-content animated-modal">
        <view class="modal-header">
          <text class="modal-title">新建班级</text>
          <text class="close-btn" @click="closeAddClassModal">×</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <label class="form-label">班级名称</label>
            <input 
              class="search-input" 
              v-model="newClass.className" 
              placeholder="请输入班级名称"
            />
          </view>
          
          <view class="form-group">
            <label class="form-label">年级</label>
            <input 
              class="search-input" 
              v-model="newClass.grade" 
              placeholder="请输入年级"
            />
          </view>
          
          <view class="form-group">
            <label class="form-label">选择老师</label>
            <!-- 添加搜索框 -->
            <view class="search-container">
              <input 
                class="search-input" 
                v-model="teacherSearchKeyword" 
                placeholder="搜索老师姓名" 
                @input="onTeacherSearchInput"
              />
            </view>
            <view class="teacher-selection">
              <view 
                class="teacher-item" 
                v-for="(teacher, index) in filteredTeachers" 
                :key="teacher._id"
                @click="toggleTeacherSelection(teacher)"
                :class="{ selected: isSelectedTeacher(teacher) }"
              >
                <view class="teacher-avatar">
                  <text class="avatar-text">{{ getTeacherAvatarText(teacher) }}</text>
                </view>
                <text class="teacher-name">{{ teacher.teacherName || teacher.username }}</text>
                <view class="selection-indicator" v-if="isSelectedTeacher(teacher)">
                  <text class="check-icon">✓</text>
                </view>
              </view>
              <!-- 当搜索结果为空时显示提示 -->
              <view v-if="filteredTeachers.length === 0 && teacherSearchKeyword" class="no-result">
                <text class="no-result-text">未找到匹配的老师</text>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeAddClassModal">取消</button>
          <button class="confirm-btn" @click="addClass">确定</button>
        </view>
      </view>
    </view>

    <!-- 班级详情弹窗 -->
    <view class="modal" v-if="showClassDetailModal">
      <view class="modal-content class-detail-modal animated-modal">
        <view class="modal-header">
          <text class="modal-title">{{ currentClass.className }} 班级详情</text>
          <text class="close-btn" @click="closeClassDetailModal">×</text>
        </view>
        <view class="modal-body">
          <view class="detail-section">
            <text class="section-title">班级老师</text>
            <view class="teacher-list">
              <view 
                class="teacher-item" 
                v-for="(teacher, index) in currentClass.teachers" 
                :key="teacher._id"
              >
                <view class="teacher-avatar">
                  <text class="avatar-text">{{ getTeacherAvatarText(teacher) }}</text>
                </view>
                <view class="teacher-info">
                  <text class="teacher-name">{{ teacher.teacherName || teacher.username }}</text>
                </view>
                <text class="remove-btn" @click="removeTeacher(teacher)">移除</text>
              </view>
              
              <!-- 根据是否有老师显示不同按钮 -->
              <view v-if="currentClass.teachers && currentClass.teachers.length > 0" class="replace-teacher-btn" @click="showReplaceTeacherModal">
                <text>🔄 替换老师</text>
              </view>
              <view v-else class="add-teacher-btn" @click="showAddTeacherModal">
                <text>+ 添加老师</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">班级学生</text>
            <view class="student-list">
              <view 
                class="student-item" 
                v-for="(student, index) in currentClass.students" 
                :key="student._id"
              >
                <view class="student-avatar">
                  <text class="avatar-text">{{ (student.name || '学').charAt(0) }}</text>
                </view>
                <view class="student-info">
                  <text class="student-name">{{ student.name }}</text>
                  <text class="student-id">{{ student.studentId }}</text>
                  <text class="student-grade" v-if="student.grade">{{ student.grade }}</text>
                </view>
                <text class="remove-btn" @click="removeStudent(student)">移除</text>
              </view>
              
              <!-- 无学生提示 -->
              <view v-if="!currentClass.students || currentClass.students.length === 0" class="no-student-tip">
                <text class="no-student-text">暂无学生</text>
              </view>
              
              <view class="add-student-btn" @click="showAddStudentModal">
                <text>+ 添加学生</text>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeClassDetailModal">关闭</button>
        </view>
      </view>
    </view>

    <!-- 添加老师弹窗 -->
    <view class="modal" v-if="showAddTeacherModalFlag">
      <view class="modal-content animated-modal">
        <view class="modal-header">
          <text class="modal-title">选择老师</text>
          <text class="close-btn" @click="closeAddTeacherModal">×</text>
        </view>
        <view class="modal-body">
          <!-- 搜索框 -->
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="teacherSearchKeyword" 
              placeholder="🔍 搜索老师姓名或用户名"
              @input="filterTeachers"
            />
            <text class="search-icon">🔍</text>
          </view>
          
          <!-- 老师列表 -->
          <view class="teacher-selection">
            <view 
              class="teacher-item" 
              v-for="(teacher, index) in filteredTeacherList" 
              :key="teacher._id"
              @click="selectTeacherToAdd(teacher)"
              :class="{ selected: isTeacherToAddSelected(teacher) }"
            >
              <view class="teacher-avatar">
                <text class="avatar-text">{{ getTeacherAvatarText(teacher) }}</text>
              </view>
              <view class="teacher-info">
                <text class="teacher-name">{{ teacher.teacherName || teacher.username }}</text>
                <text class="teacher-username" v-if="teacher.teacherName && teacher.username">@{{ teacher.username }}</text>
              </view>
              <view class="selection-indicator" v-if="isTeacherToAddSelected(teacher)">
                <text class="check-icon">✓</text>
              </view>
            </view>
            
            <!-- 无搜索结果提示 -->
            <view v-if="filteredTeacherList.length === 0 && teacherSearchKeyword" class="no-result">
              <text class="no-result-text">未找到匹配的老师</text>
            </view>
            
            <!-- 无老师提示 -->
            <view v-if="filteredTeacherList.length === 0 && !teacherSearchKeyword" class="no-result">
              <text class="no-result-text">暂无老师数据</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeAddTeacherModal">取消</button>
          <button class="confirm-btn" @click="addTeacherToClass" :disabled="!teacherToAdd">确定</button>
        </view>
      </view>
    </view>

    <!-- 替换老师弹窗 -->
    <view class="modal" v-if="showReplaceTeacherModalFlag">
      <view class="modal-content animated-modal">
        <view class="modal-header">
          <text class="modal-title">替换班主任</text>
          <text class="close-btn" @click="closeReplaceTeacherModal">×</text>
        </view>
        <view class="modal-body">
          <!-- 搜索框 -->
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="teacherSearchKeyword" 
              placeholder="🔍 搜索老师姓名或用户名"
              @input="filterTeachers"
            />
            <text class="search-icon">🔍</text>
          </view>
          
          <!-- 老师列表 -->
          <view class="teacher-selection">
            <view 
              class="teacher-item" 
              v-for="(teacher, index) in filteredTeacherList" 
              :key="teacher._id"
              @click="selectTeacherToReplace(teacher)"
              :class="{ selected: isTeacherToReplaceSelected(teacher) }"
            >
              <view class="teacher-avatar">
                <text class="avatar-text">{{ getTeacherAvatarText(teacher) }}</text>
              </view>
              <view class="teacher-info">
                <text class="teacher-name">{{ teacher.teacherName || teacher.username }}</text>
                <text class="teacher-username" v-if="teacher.teacherName && teacher.username">@{{ teacher.username }}</text>
              </view>
              <view class="selection-indicator" v-if="isTeacherToReplaceSelected(teacher)">
                <text class="check-icon">✓</text>
              </view>
            </view>
            
            <!-- 无搜索结果提示 -->
            <view v-if="filteredTeacherList.length === 0 && teacherSearchKeyword" class="no-result">
              <text class="no-result-text">未找到匹配的老师</text>
            </view>
            
            <!-- 无老师提示 -->
            <view v-if="filteredTeacherList.length === 0 && !teacherSearchKeyword" class="no-result">
              <text class="no-result-text">暂无老师数据</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeReplaceTeacherModal">取消</button>
          <button class="confirm-btn" @click="replaceTeacher" :disabled="!teacherToReplace">确定</button>
        </view>
      </view>
    </view>

    <!-- 添加学生弹窗 -->
    <view class="modal" v-if="showAddStudentModalFlag">
      <view class="modal-content animated-modal">
        <view class="modal-header">
          <text class="modal-title">选择学生</text>
          <text class="close-btn" @click="closeAddStudentModal">×</text>
        </view>
        <view class="modal-body">
          <!-- 搜索框 -->
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="studentSearchKeyword" 
              placeholder="🔍 搜索学生姓名或学号"
              @input="filterStudents"
            />
            <text class="search-icon">🔍</text>
          </view>
          
          <!-- 学生列表 -->
          <view class="student-selection-list">
            <view 
              v-for="student in filteredStudentList" 
              :key="student._id"
              class="student-selection-item"
              :class="{selected: isStudentSelected(student)}"
              @click="selectStudent(student)"
            >
              <view class="student-avatar">
                <text class="avatar-text">{{ (student.name || '学').charAt(0) }}</text>
              </view>
              <view class="student-info">
                <text class="student-name">{{ student.name }}</text>
                <text class="student-details">{{ student.studentId }} · {{ student.grade }}</text>
              </view>
              <text v-if="isStudentSelected(student)" class="check-icon">✓</text>
            </view>
            
            <!-- 无搜索结果提示 -->
            <view v-if="filteredStudentList.length === 0 && studentSearchKeyword" class="no-result">
              <text class="no-result-text">未找到匹配的学生</text>
            </view>
            
            <!-- 无学生提示 -->
            <view v-if="filteredStudentList.length === 0 && !studentSearchKeyword" class="no-result">
              <text class="no-result-text">暂无学生数据，请先通过学生录入功能添加学生</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeAddStudentModal">取消</button>
          <button class="confirm-btn" @click="addSelectedStudentsToClass" :disabled="selectedStudents.length === 0">
            确定 ({{ selectedStudents.length }})
          </button>
        </view>
      </view>
    </view>

    <!-- 浮动新建班级按钮 -->
    <view class="floating-add-btn" @click="showAddClassModal">
      <image class="add-icon" src="/static/745 (1).png" mode="aspectFit"></image>
    </view>

    <!-- Toast提示 -->
    <view class="toast" v-if="showToast">
      <text class="toast-text">{{ toastMessage }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classList: [],
      filteredClassList: [],
      teacherList: [],
      showAddClassModalFlag: false,
      showClassDetailModal: false,
      showAddTeacherModalFlag: false,
      showReplaceTeacherModalFlag: false,
      showAddStudentModalFlag: false,
      showToast: false,
      toastMessage: '',
      newClass: {
        className: '',
        grade: '',
        teachers: []
      },
      currentClass: {
        className: '',
        teachers: [],
        students: []
      },
      newStudent: {
        studentName: '',
        grade: ''
      },
      selectedTeachers: [],
      teacherToAdd: null,
      teacherToReplace: null,
      studentList: [],
      filteredStudentList: [],
      studentSearchKeyword: '',
      selectedStudents: [],
      filteredTeacherList: [],
      teacherSearchKeyword: '',
      filteredTeachers: [],
      // 搜索和筛选相关
      searchKeyword: '',
      gradeIndex: 0,
      subjectIndex: 0,
      gradeOptions: ['全部年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
      subjectOptions: ['全部科目', '语文', '数学', '英语', '物理', '化学']
    }
  },
  onLoad() {
    this.loadClassList()
    this.loadTeacherList()
    this.loadStudentList()
  },
  computed: {
  },
  watch: {
    // 监听筛选条件变化，自动重新筛选
    searchKeyword() {
      this.filterClassList()
    },
    gradeIndex() {
      this.filterClassList()
    },
    subjectIndex() {
      this.filterClassList()
    }
  },
  methods: {
    // 添加返回方法
    goBack() {
      uni.navigateBack()
    },
    
    // 加载班级列表
    async loadClassList() {
      try {
        console.log('开始加载班级列表...')
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: 1000 // 获取所有班级
          }
        })
        
        console.log('班级列表云函数返回结果:', res)
        
        if (res.result.code === 0) {
          this.classList = res.result.data || []
          console.log('班级列表加载成功，数量:', this.classList.length)
          console.log('班级列表数据:', this.classList)
          
          // 调试日志：显示第一个班级的teachers信息
          if (this.classList.length > 0) {
            console.log('第一个班级的teachers信息:', this.classList[0].teachers)
            console.log('第一个班级的headTeacher:', this.classList[0].headTeacher)
          }
          
          this.filterClassList() // 加载完成后立即筛选
        } else {
          console.error('加载班级列表失败:', res.result.message)
          this.showToastMessage('加载班级列表失败: ' + res.result.message)
        }
      } catch (error) {
        console.error('加载班级列表失败:', error)
        this.showToastMessage('加载班级列表失败: ' + error.message)
      }
    },
    
    // 筛选班级列表
    filterClassList() {
      let filtered = [...this.classList]
      
      // 按搜索关键词筛选
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim()
        filtered = filtered.filter(item => 
          item.className && item.className.toLowerCase().includes(keyword)
        )
      }
      
      // 按年级筛选
      if (this.gradeIndex > 0) {
        const selectedGrade = this.gradeOptions[this.gradeIndex]
        filtered = filtered.filter(item => item.grade === selectedGrade)
      }
      
      // 按科目筛选
      if (this.subjectIndex > 0) {
        const selectedSubject = this.subjectOptions[this.subjectIndex]
        filtered = filtered.filter(item => 
          item.className && item.className.includes(selectedSubject)
        )
      }
      
      this.filteredClassList = filtered
    },
    
    // 搜索输入处理
    onSearchInput() {
      // 搜索输入由watch自动处理
    },
    
    // 年级选择变化
    onGradeChange(e) {
      this.gradeIndex = e.detail.value
    },
    
    // 科目选择变化
    onSubjectChange(e) {
      this.subjectIndex = e.detail.value
    },
    
    // 高亮显示搜索关键词
    highlightText(text, keyword) {
      if (!text) {
        return ''
      }
      
      if (!keyword || !keyword.trim()) {
        return text
      }
      
      const regex = new RegExp(`(${keyword.trim()})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    },
    
    // 加载老师列表
    async loadTeacherList() {
      try {
        console.log('开始加载教师列表...')
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'getTeacherList'
          }
        })
        
        console.log('教师列表云函数返回结果:', res)
        
        if (res.result.code === 0) {
          this.teacherList = res.result.data
          this.filteredTeacherList = [...res.result.data]
          this.filteredTeachers = [...res.result.data]
          console.log('教师列表加载成功，数量:', this.teacherList.length)
          console.log('教师列表数据:', this.teacherList)
          
          // 检查是否包含教务账号
          const academicAccounts = this.teacherList.filter(teacher => 
            teacher.mobile === '18186191270' || 
            teacher.username === '18186191270' ||
            (teacher.teacherName && teacher.teacherName.includes('教务')) ||
            // 检查手机号用户名且姓名只有1个字的账号
            (teacher.username && /^1\d{10}$/.test(teacher.username) && 
             teacher.teacherName && teacher.teacherName.length === 1)
          )
          if (academicAccounts.length > 0) {
            console.log('⚠️ 警告：教师列表中仍包含教务账号:', academicAccounts)
            // 详细显示每个教务账号的信息
            academicAccounts.forEach(account => {
              console.log('📋 教务账号详细信息:', {
                _id: account._id,
                username: account.username,
                teacherName: account.teacherName,
                mobile: account.mobile,
                // 如果有其他字段也显示出来
                ...account
              })
            })
          } else {
            console.log('✅ 教师列表已正确过滤，不包含教务账号')
          }
        } else {
          console.error('加载教师列表失败:', res.result.message)
          this.showToastMessage('加载老师列表失败: ' + res.result.message)
        }
      } catch (error) {
        console.error('加载老师列表失败:', error)
        this.showToastMessage('加载老师列表失败: ' + error.message)
      }
    },
    
    // 显示新建班级弹窗
    showAddClassModal() {
      this.showAddClassModalFlag = true
      this.newClass = {
        className: '',
        teachers: []
      }
      this.selectedTeachers = []
      this.teacherSearchKeyword = ''
      this.filteredTeachers = [...this.teacherList]
    },
    
    // 关闭新建班级弹窗
    closeAddClassModal() {
      this.showAddClassModalFlag = false
    },
    
    // 老师搜索输入处理
    onTeacherSearchInput() {
      console.log('老师搜索输入:', this.teacherSearchKeyword)
      console.log('当前教师列表长度:', this.teacherList.length)
      
      if (!this.teacherSearchKeyword.trim()) {
        this.filteredTeachers = [...this.teacherList]
        console.log('搜索关键词为空，显示所有教师:', this.filteredTeachers.length)
        return
      }
      
      const keyword = this.teacherSearchKeyword.toLowerCase().trim()
      this.filteredTeachers = this.teacherList.filter(teacher => {
        const name = (teacher.teacherName || teacher.username || '').toLowerCase()
        const match = name.includes(keyword)
        console.log(`教师 ${name} 匹配关键词 ${keyword}:`, match)
        return match
      })
      
      console.log('搜索后过滤的教师数量:', this.filteredTeachers.length)
    },
    
    // 切换老师选择状态
    toggleTeacherSelection(teacher) {
      const index = this.selectedTeachers.findIndex(t => t._id === teacher._id)
      if (index > -1) {
        this.selectedTeachers.splice(index, 1)
      } else {
        this.selectedTeachers.push(teacher)
      }
    },
    
    // 判断老师是否被选中
    isSelectedTeacher(teacher) {
      return this.selectedTeachers.some(t => t._id === teacher._id)
    },
    
    // 新建班级
    async addClass() {
      if (!this.newClass.className) {
        this.showToastMessage('请输入班级名称')
        return
      }
      
      if (!this.newClass.grade) {
        this.showToastMessage('请输入年级')
        return
      }
      
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'createClass',
            className: this.newClass.className,
            grade: this.newClass.grade,
            teachers: this.selectedTeachers
          }
        })
        
        if (res.result.code === 0) {
          this.showToastMessage('班级创建成功')
          this.closeAddClassModal()
          this.loadClassList()
          
          // 班级创建成功，无需更新缓存
        } else {
          this.showToastMessage(res.result.message || '班级创建失败')
        }
      } catch (error) {
        console.error('创建班级失败:', error)
        this.showToastMessage('班级创建失败')
      }
    },
    
    // 打开班级详情
    openClassDetail(classItem) {
      this.currentClass = JSON.parse(JSON.stringify(classItem))
      this.showClassDetailModal = true
    },
    
    // 关闭班级详情弹窗
    closeClassDetailModal() {
      this.showClassDetailModal = false
    },
    
    // 获取老师姓名列表
    getTeacherNames(teachers) {
      if (!teachers || teachers.length === 0) return '未设置'
      return teachers.map(t => t.teacherName || t.username).join(', ')
    },
    
    // 获取老师头像文字
    getTeacherAvatarText(teacher) {
      if (!teacher) return '师'
      
      // 优先使用老师姓名
      if (teacher.teacherName && teacher.teacherName.trim()) {
        return teacher.teacherName.trim().charAt(0)
      }
      
      // 其次使用用户名
      if (teacher.username && teacher.username.trim()) {
        return teacher.username.trim().charAt(0)
      }
      
      // 最后使用默认文字
      return '师'
    },
    
    // 显示添加老师弹窗
    showAddTeacherModal() {
      this.showAddTeacherModalFlag = true
      this.teacherToAdd = null
      this.teacherSearchKeyword = ''
      this.filteredTeacherList = [...this.teacherList]
    },
    
    // 关闭添加老师弹窗
    closeAddTeacherModal() {
      this.showAddTeacherModalFlag = false
      this.teacherSearchKeyword = ''
    },
    
    // 显示替换老师弹窗
    showReplaceTeacherModal() {
      this.showReplaceTeacherModalFlag = true
      this.teacherToReplace = null
      this.teacherSearchKeyword = ''
      this.filteredTeacherList = [...this.teacherList]
    },
    
    // 关闭替换老师弹窗
    closeReplaceTeacherModal() {
      this.showReplaceTeacherModalFlag = false
      this.teacherSearchKeyword = ''
    },
    
    // 过滤老师列表
    filterTeachers() {
      if (!this.teacherSearchKeyword.trim()) {
        this.filteredTeacherList = [...this.teacherList]
        return
      }
      
      const keyword = this.teacherSearchKeyword.toLowerCase().trim()
      this.filteredTeacherList = this.teacherList.filter(teacher => {
        const teacherName = (teacher.teacherName || '').toLowerCase()
        const username = (teacher.username || '').toLowerCase()
        return teacherName.includes(keyword) || username.includes(keyword)
      })
    },
    
    // 选择要添加的老师
    selectTeacherToAdd(teacher) {
      this.teacherToAdd = teacher
    },
    
    // 判断要添加的老师是否被选中
    isTeacherToAddSelected(teacher) {
      return this.teacherToAdd && this.teacherToAdd._id === teacher._id
    },
    
    // 选择要替换的老师
    selectTeacherToReplace(teacher) {
      this.teacherToReplace = teacher
    },
    
    // 判断要替换的老师是否被选中
    isTeacherToReplaceSelected(teacher) {
      return this.teacherToReplace && this.teacherToReplace._id === teacher._id
    },
    
    // 添加老师到班级
    async addTeacherToClass() {
      if (!this.teacherToAdd) {
        this.showToastMessage('请选择要添加的老师')
        return
      }
      
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'addTeacherToClass',
            classId: this.currentClass._id,
            teacher: this.teacherToAdd
          }
        })
        
        if (res.result.code === 0) {
          this.showToastMessage('老师添加成功')
          this.closeAddTeacherModal()
          // 更新当前班级的老师列表
          if (!this.currentClass.teachers) {
            this.currentClass.teachers = []
          }
          this.currentClass.teachers.push(this.teacherToAdd)
          // 重新加载班级列表
          this.loadClassList()
        } else {
          this.showToastMessage(res.result.message || '添加老师失败')
        }
      } catch (error) {
        console.error('添加老师到班级失败:', error)
        this.showToastMessage('添加老师失败')
      }
    },
    
    // 替换老师
    async replaceTeacher() {
      if (!this.teacherToReplace) {
        this.showToastMessage('请选择要替换的老师')
        return
      }
      
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'replaceTeacher',
            classId: this.currentClass._id,
            newTeacher: this.teacherToReplace
          }
        })
        
        if (res.result.code === 0) {
          this.showToastMessage('老师替换成功')
          this.closeReplaceTeacherModal()
          // 更新当前班级的老师列表
          this.currentClass.teachers = [this.teacherToReplace]
          // 重新加载班级列表
          this.loadClassList()
        } else {
          this.showToastMessage(res.result.message || '替换老师失败')
        }
      } catch (error) {
        console.error('替换老师失败:', error)
        this.showToastMessage('替换老师失败')
      }
    },
    
    // 移除班级老师
    async removeTeacher(teacher) {
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'removeTeacherFromClass',
            classId: this.currentClass._id,
            teacherId: teacher._id
          }
        })
        
        if (res.result.code === 0) {
          this.showToastMessage('老师移除成功')
          // 更新当前班级的老师列表
          const index = this.currentClass.teachers.findIndex(t => t._id === teacher._id)
          if (index > -1) {
            this.currentClass.teachers.splice(index, 1)
          }
          // 重新加载班级列表
          this.loadClassList()
        } else {
          this.showToastMessage(res.result.message || '移除老师失败')
        }
      } catch (error) {
        console.error('移除老师失败:', error)
        this.showToastMessage('移除老师失败')
      }
    },
    
    // 显示添加学生弹窗
    showAddStudentModal() {
      this.showAddStudentModalFlag = true
      this.studentSearchKeyword = ''
      this.selectedStudents = []
      this.filteredStudentList = [...this.studentList]
    },
    
    // 关闭添加学生弹窗
    closeAddStudentModal() {
      this.showAddStudentModalFlag = false
      this.studentSearchKeyword = ''
      this.selectedStudents = []
    },
    
    // 过滤学生列表
    filterStudents() {
      if (!this.studentSearchKeyword.trim()) {
        this.filteredStudentList = [...this.studentList]
        return
      }
      
      const keyword = this.studentSearchKeyword.toLowerCase().trim()
      this.filteredStudentList = this.studentList.filter(student => {
        const name = (student.name || '').toLowerCase()
        const studentId = (student.studentId || '').toLowerCase()
        return name.includes(keyword) || studentId.includes(keyword)
      })
    },
    
    // 选择学生
    selectStudent(student) {
      const index = this.selectedStudents.findIndex(s => s._id === student._id)
      if (index > -1) {
        this.selectedStudents.splice(index, 1)
      } else {
        this.selectedStudents.push(student)
      }
    },
    
    // 判断学生是否被选中
    isStudentSelected(student) {
      return this.selectedStudents.some(s => s._id === student._id)
    },
    
    // 加载学生列表
    async loadStudentList() {
      try {
        const res = await uniCloud.callFunction({
          name: 'student-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: 1000 // 获取所有学生
          }
        })
        
        if (res.result.code === 0) {
          this.studentList = res.result.data.list
          this.filteredStudentList = [...res.result.data.list]
        } else {
          this.showToastMessage('加载学生列表失败')
        }
      } catch (error) {
        console.error('加载学生列表失败:', error)
        this.showToastMessage('加载学生列表失败')
      }
    },
    
    // 添加选中的学生到班级
    async addSelectedStudentsToClass() {
      if (this.selectedStudents.length === 0) {
        this.showToastMessage('请选择要添加的学生')
        return
      }
      
      try {
        const promises = this.selectedStudents.map(student => {
          return uniCloud.callFunction({
            name: 'class-management',
            data: {
              action: 'addStudentToClass',
              classId: this.currentClass._id,
              studentId: student.studentId,
              studentName: student.name,
              grade: student.grade
            }
          })
        })
        
        const results = await Promise.all(promises)
        const successCount = results.filter(res => res.result.code === 0).length
        
        if (successCount > 0) {
          this.showToastMessage(`成功添加 ${successCount} 名学生`)
          this.closeAddStudentModal()
          // 重新加载班级列表
          this.loadClassList()
          // 重新加载学生列表
          this.loadStudentList()
        } else {
          this.showToastMessage('添加学生失败')
        }
      } catch (error) {
        console.error('添加学生失败:', error)
        this.showToastMessage('添加学生失败')
      }
    },
    
    // 移除班级学生
    async removeStudent(student) {
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'removeStudentFromClass',
            classId: this.currentClass._id,
            studentId: student._id
          }
        })
        
        if (res.result.code === 0) {
          this.showToastMessage('学生移除成功')
          // 更新当前班级的学生列表
          const index = this.currentClass.students.findIndex(s => s._id === student._id)
          if (index > -1) {
            this.currentClass.students.splice(index, 1)
          }
          // 重新加载班级列表
          this.loadClassList()
        } else {
          this.showToastMessage(res.result.message || '移除学生失败')
        }
      } catch (error) {
        console.error('移除学生失败:', error)
        this.showToastMessage('移除学生失败')
      }
    },
    
    // 删除班级
    async deleteClass(classItem) {
      // 确认删除
      uni.showModal({
        title: '确认删除',
        content: `确定要删除班级"${classItem.className}"吗？此操作将删除该班级及其所有学生和老师关联。`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await uniCloud.callFunction({
                name: 'class-management',
                data: {
                  action: 'deleteClass',
                  classId: classItem._id
                }
              })
              
              if (result.result.code === 0) {
                this.showToastMessage('班级删除成功')
                this.loadClassList()
              } else {
                console.error('删除班级失败:', result.result);
                this.showToastMessage(result.result.message || '删除班级失败')
              }
            } catch (error) {
              console.error('删除班级失败:', error);
              this.showToastMessage('删除班级失败: ' + error.message)
            }
          }
        }
      })
    },
    
    // 显示Toast提示
    showToastMessage(message) {
      this.toastMessage = message
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 2000)
    },
    
  }
}
</script>

<style scoped>
.container {
  padding: 50rpx 20rpx 20rpx 20rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
}

.page-header {
  padding: 20rpx 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  position: relative;
  backdrop-filter: blur(10rpx);
  animation: fadeInDown 0.5s ease;
}

.back-button {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 40rpx;
  height: 40rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #1976D2;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1976D2;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 搜索和筛选区域样式 */
.search-filter-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  animation: fadeInUp 0.4s ease;
}

.search-container {
  position: relative;
  margin-bottom: 25rpx;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  border-radius: 12rpx;
  padding: 15rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.15);
  border: 2rpx solid rgba(79, 195, 247, 0.2);
}

.search-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #4FC3F7;
  border-radius: 10rpx;
  padding: 0 60rpx 0 25rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1976D2;
  box-shadow: 0 4rpx 16rpx rgba(25, 118, 210, 0.2);
  transform: translateY(-1rpx);
}

.search-input::placeholder {
  color: #999;
  font-size: 28rpx;
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #4FC3F7;
  font-weight: bold;
}

.filter-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.filter-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 25rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
  box-sizing: border-box;
  width: auto;
}

.filter-group:active {
  transform: translateY(-1rpx);
  box-shadow: 0 4rpx 12rpx rgba(25, 118, 210, 0.15);
}

.filter-label {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-picker {
  flex: 1;
  margin-left: 20rpx;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15rpx 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.picker-arrow {
  font-size: 20rpx;
  color: #1976D2;
  margin-left: 10rpx;
  transition: transform 0.3s ease;
}


/* 高亮文本样式 */
.highlight {
  background: linear-gradient(135deg, #ffeb3b 0%, #ffc107 100%);
  color: #333;
  padding: 2rpx 4rpx;
  border-radius: 4rpx;
  font-weight: bold;
  box-shadow: 0 2rpx 4rpx rgba(255, 193, 7, 0.3);
}

/* 无结果提示样式 */
.no-result-tip {
  text-align: center;
  padding: 80rpx 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  margin: 20rpx 0;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
}

.no-result-text {
  font-size: 28rpx;
  color: #999;
  font-style: italic;
}

/* 浮动新建班级按钮 */
.floating-add-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  z-index: 100;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.floating-add-btn:active {
  transform: scale(0.95);
}

.add-icon {
  width: 120rpx;
  height: 120rpx;
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.animated-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  animation: fadeInUp 0.4s ease;
}

.animated-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.class-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.class-badge {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(25, 118, 210, 0.2);
}

.class-badge-text {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.class-info-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.class-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.class-grade-badge {
  font-size: 24rpx;
  color: #1976D2;
  background: rgba(25, 118, 210, 0.1);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.student-count-badge {
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(76, 175, 80, 0.2);
}

.count-text {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

.class-details {
  margin-bottom: 20rpx;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 10rpx;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.empty-value {
  color: #999;
  font-style: italic;
}

.class-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  color: #ff4d4f;
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  border: 1rpx solid #ff4d4f;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:active {
  background-color: #ff4d4f;
  color: white;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(5rpx);
  animation: fadeIn 0.3s ease;
}

.animated-modal {
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  width: 95%;
  max-width: 650rpx;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  animation: modalAppear 0.3s ease-out;
}

.class-detail-modal {
  max-height: 90vh;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16rpx 16rpx 0 0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1976D2;
}

.close-btn {
  position: absolute;
  right: 30rpx;
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:active {
  color: #333;
  transform: rotate(90deg);
}

.modal-body {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #1976D2;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.input-wrapper {
  background: #fff;
  border-radius: 12rpx;
  padding: 10rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

/* 基础输入框样式 - 现在使用统一的search-input-style */

/* 搜索框样式 */
.search-container {
  margin-bottom: 20rpx;
}

.search-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333 !important;
  background: #fff !important;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #666 !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

.search-input::-webkit-input-placeholder {
  color: #666 !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

.search-input::-moz-placeholder {
  color: #666 !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

.search-input:-ms-input-placeholder {
  color: #666 !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

.search-input:focus {
  border-color: #1976D2;
  box-shadow: 0 0 0 2rpx rgba(25, 118, 210, 0.2);
}


/* 无搜索结果提示 */
.no-result {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999;
}

.no-result-text {
  font-size: 26rpx;
  color: #999;
}

.teacher-selection {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  max-height: 500rpx;
  overflow-y: auto;
}

.teacher-item {
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 2rpx solid #e5e5e5;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.teacher-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.teacher-item.selected {
  border-color: #4FC3F7;
  background: #f0f8ff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.2);
}

.teacher-avatar {
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15rpx;
}

.avatar-text {
  font-size: 24rpx;
  font-weight: bold;
  color: white;
}

.teacher-info {
  flex: 1;
  margin: 0 20rpx;
}

.teacher-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 5rpx;
}

.teacher-username {
  font-size: 24rpx;
  color: #666;
}


.selection-indicator {
  margin-left: auto;
  width: 30rpx;
  height: 30rpx;
  background: #4FC3F7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 20rpx;
  color: white;
  font-weight: bold;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  border-radius: 0 0 16rpx 16rpx;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
}

.cancel-btn, .confirm-btn {
  padding: 13rpx 100rpx;
  border-radius: 10rpx;
  font-size: 23rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.cancel-btn {
  background: #f8f9fa;
  color: #333;
  border: 1rpx solid #ddd;
}

.cancel-btn:active {
  background: #e9ecef;
  transform: translateY(2rpx);
}

.confirm-btn {
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  color: white;
  border: none;
  box-shadow: 0 4rpx 15rpx rgba(25, 118, 210, 0.3);
}

.confirm-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(25, 118, 210, 0.4);
}

.detail-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  margin-bottom: 25rpx;
  display: block;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.teacher-list, .student-list {
  background: rgba(25, 118, 210, 0.03);
  border-radius: 12rpx;
  padding: 20rpx;
}

.teacher-item, .student-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.teacher-item:last-child, .student-item:last-child {
  border-bottom: none;
}

.student-info {
  flex: 1;
  margin: 0 20rpx;
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.student-id {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 3rpx;
}

.student-grade {
  font-size: 22rpx;
  color: #666;
}

.no-student-tip {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999;
}

.no-student-text {
  font-size: 26rpx;
  color: #999;
}

.remove-btn {
  color: #ff4d4f;
  font-size: 26rpx;
  padding: 10rpx 20rpx;
  border: 1rpx solid #ff4d4f;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:active {
  background-color: #ff4d4f;
  color: white;
}

.add-teacher-btn, .add-student-btn {
  padding: 20rpx;
  text-align: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976D2;
  border-radius: 12rpx;
  margin-top: 15rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  border: 1rpx dashed #1976D2;
}

.add-teacher-btn:active, .add-student-btn:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 10rpx rgba(25, 118, 210, 0.2);
}

.replace-teacher-btn {
  padding: 20rpx;
  text-align: center;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
  border-radius: 12rpx;
  margin-top: 15rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  border: 1rpx dashed #f57c00;
}

.replace-teacher-btn:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 10rpx rgba(245, 124, 0, 0.2);
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 25rpx 45rpx;
  border-radius: 12rpx;
  z-index: 1000;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  animation: toastAppear 0.3s ease;
}

@keyframes toastAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.toast-text {
  font-size: 28rpx;
}

/* 学生选择相关样式 */
.search-container {
  position: relative;
  margin-bottom: 25rpx;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  border-radius: 12rpx;
  padding: 15rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.15);
  border: 2rpx solid rgba(79, 195, 247, 0.2);
}

.search-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #4FC3F7;
  border-radius: 10rpx;
  padding: 0 60rpx 0 25rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1976D2;
  box-shadow: 0 4rpx 16rpx rgba(25, 118, 210, 0.2);
  transform: translateY(-1rpx);
}

.search-input::placeholder {
  color: #999;
  font-size: 28rpx;
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #4FC3F7;
  font-weight: bold;
}

.student-selection-list {
  max-height: 500rpx;
  overflow-y: auto;
}

.student-selection-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
  margin-bottom: 15rpx;
  background: #fff;
  transition: all 0.3s ease;
}

.student-selection-item.selected {
  border-color: #4FC3F7;
  background: #f0f8ff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.2);
}

.student-avatar {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.avatar-text {
  font-size: 28rpx;
  font-weight: bold;
  color: white;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 5rpx;
}

.student-details {
  font-size: 24rpx;
  color: #666;
}

.no-result {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999;
}

.no-result-text {
  font-size: 26rpx;
  color: #999;
}
</style>
