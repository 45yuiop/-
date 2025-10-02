<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">档案管理</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-container">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索学生姓名、学号或班级"
          @input="onSearchInput"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <text class="clear-icon">×</text>
        </view>
      </view>
    </view>
    
    <!-- 分类标签 -->
    <view class="category-tabs">
      <view 
        class="category-tab"
        :class="{active: activeTab === 'all'}"
        @click="switchTab('all')"
      >
        全部
      </view>
      <view 
        class="category-tab"
        :class="{active: activeTab === 'students'}"
        @click="switchTab('students')"
      >
        学生档案
      </view>
      <view 
        class="category-tab"
        :class="{active: activeTab === 'classes'}"
        @click="switchTab('classes')"
      >
        班级档案
      </view>
    </view>
    
    
    <!-- 编辑模式切换 -->
    <view v-if="!isEditMode" class="edit-mode-toggle">
      <view class="edit-mode-btn" @click="enterEditMode">
        <image class="edit-icon" src="/static/745 (1).png" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 后台加载进度指示器 -->
    <view v-if="localCache.isLoadingBackground" class="background-loading-indicator">
      <view class="loading-progress">
        <text class="loading-text">正在后台加载更多数据... {{ localCache.backgroundLoadProgress }}%</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{width: localCache.backgroundLoadProgress + '%'}"></view>
        </view>
      </view>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-container">
      <view class="filter-row">
        <view class="filter-item">
          <text class="filter-label">年级筛选：</text>
          <picker 
            mode="selector" 
            :value="gradeFilterIndex" 
            :range="gradeOptions" 
            @change="onGradeFilterChange"
          >
            <view class="filter-picker">
              {{ gradeFilter || '全部年级' }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <view class="filter-item">
          <text class="filter-label">排序方式：</text>
          <picker 
            mode="selector" 
            :value="sortIndex" 
            :range="sortOptions" 
            @change="onSortChange"
          >
            <view class="filter-picker">
              {{ sortOptions[sortIndex] }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>
    
    <!-- 数据列表 -->
    <view class="data-container">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 学生档案列表 -->
      <view v-if="activeTab === 'all' || activeTab === 'students'" class="section">
        <view class="section-title">
          <text class="title-text">学生档案 ({{ studentsTotal }})</text>
        </view>
        
        <view v-if="paginatedStudents.length === 0 && !loading" class="empty-state">
          <text class="empty-text">暂无学生档案</text>
        </view>
        
        <!-- 学生分页控件 -->
        <view v-if="showStudentsPagination" class="pagination-container">
          <view class="pagination-info">
            <text class="pagination-text">第 {{ studentsPage }} 页，共 {{ studentsTotalPages }} 页</text>
          </view>
          <view class="pagination-buttons">
            <button 
              class="pagination-btn prev-btn" 
              :disabled="studentsPage <= 1"
              @click="prevPage('students')"
            >
              上一页
            </button>
            <button 
              class="pagination-btn next-btn" 
              :disabled="!hasMoreStudents"
              @click="nextPage('students')"
            >
              下一页
            </button>
          </view>
        </view>
        
        <!-- 学生数据列表 -->
        <view v-if="paginatedStudents.length > 0" class="student-list">
          <view 
            v-for="student in paginatedStudents" 
            :key="student._id"
            class="student-card"
            :class="{selected: isStudentSelected(student)}"
            @click="isEditMode ? toggleStudentSelection(student) : navigateToStudentDetail(student)"
          >
            <view v-if="isEditMode" class="selection-checkbox">
              <view class="checkbox" :class="{checked: isStudentSelected(student)}">
                <text v-if="isStudentSelected(student)" class="check-icon">✓</text>
              </view>
            </view>
            <view class="student-avatar">
              <text class="avatar-text">{{ student.name.charAt(0) }}</text>
            </view>
            <view class="student-info">
              <view class="student-header">
                <text class="student-name">{{ student.name }}</text>
                <text class="student-id">{{ student.studentId }}</text>
              </view>
              <view class="student-details">
                <text class="student-grade">{{ student.grade }}</text>
                <text class="student-subjects">{{ student.subjects.join('、') }}</text>
                <text v-if="student.school" class="student-school">{{ student.school }}</text>
              </view>
              <view class="student-meta">
                <text class="create-time">{{ formatDate(student.createTime) }}</text>
              </view>
            </view>
            <view class="student-actions">
              <text v-if="!isEditMode" class="action-icon">›</text>
              <view v-else class="edit-actions">
                <button class="delete-btn" @click.stop="showDeleteConfirm(student, 'student')">删除</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 班级档案列表 -->
      <view v-if="activeTab === 'all' || activeTab === 'classes'" class="section">
        <view class="section-title">
          <text class="title-text">班级档案 ({{ classesTotal }})</text>
        </view>
        
        <view v-if="paginatedClasses.length === 0 && !loading" class="empty-state">
          <text class="empty-text">暂无班级档案</text>
        </view>
        
        <!-- 班级分页控件 -->
        <view v-if="showClassesPagination" class="pagination-container">
          <view class="pagination-info">
            <text class="pagination-text">第 {{ classesPage }} 页，共 {{ classesTotalPages }} 页</text>
          </view>
          <view class="pagination-buttons">
            <button 
              class="pagination-btn prev-btn" 
              :disabled="classesPage <= 1"
              @click="prevPage('classes')"
            >
              上一页
            </button>
            <button 
              class="pagination-btn next-btn" 
              :disabled="!hasMoreClasses"
              @click="nextPage('classes')"
            >
              下一页
            </button>
          </view>
        </view>
        
        <!-- 班级数据列表 -->
        <view v-if="paginatedClasses.length > 0" class="class-list">
          <view 
            v-for="classItem in paginatedClasses" 
            :key="classItem._id"
            class="class-card"
            :class="{selected: isClassSelected(classItem)}"
            @click="isEditMode ? toggleClassSelection(classItem) : navigateToClassDetail(classItem)"
          >
            <view v-if="isEditMode" class="selection-checkbox">
              <view class="checkbox" :class="{checked: isClassSelected(classItem)}">
                <text v-if="isClassSelected(classItem)" class="check-icon">✓</text>
              </view>
            </view>
            <view class="class-icon">
              <text class="class-icon-text">班</text>
            </view>
            <view class="class-info">
              <view class="class-header">
                <text class="class-name">{{ classItem.className }}</text>
                <text class="class-code">{{ classItem.classCode }}</text>
              </view>
              <view class="class-details">
                <text class="class-grade">{{ classItem.grade }}</text>
                <text class="class-teacher">班主任：{{ classItem.teacherName }}</text>
                <text class="class-student-count">学生数：{{ classItem.studentCount || 0 }}</text>
              </view>
              <view class="class-meta">
                <text class="create-time">{{ formatDate(classItem.createTime) }}</text>
              </view>
            </view>
            <view class="class-actions">
              <text v-if="!isEditMode" class="action-icon">›</text>
              <view v-else class="edit-actions">
                <button class="delete-btn" @click.stop="showDeleteConfirm(classItem, 'class')">删除</button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 批量操作工具栏 - 固定在底部 -->
    <view v-if="isEditMode" class="batch-toolbar-fixed">
      <view class="toolbar-left">
        <view class="select-all-btn" @click="toggleSelectAll">
          <text class="select-all-text">{{ isAllSelected ? '取消全选' : '全选' }}</text>
        </view>
        <text class="selected-count">已选择 {{ selectedItems.length }} 项</text>
      </view>
      <view class="toolbar-right">
        <button class="batch-delete-btn" @click="showBatchDeleteConfirm" :disabled="selectedItems.length === 0">
          批量删除
        </button>
        <button class="exit-edit-btn" @click="exitEditMode">
          完成
        </button>
      </view>
    </view>
    
    <!-- 删除确认弹窗 -->
    <view v-if="showDeleteModal" class="delete-modal" @click="closeDeleteModal">
      <view class="delete-modal-content" @click.stop>
        <view class="delete-header">
          <text class="delete-title">确认删除</text>
        </view>
        <view class="delete-body">
          <text class="delete-message">{{ deleteMessage }}</text>
        </view>
        <view class="delete-footer">
          <button class="cancel-delete-btn" @click="closeDeleteModal">取消</button>
          <button class="confirm-delete-btn" @click="confirmDelete">确认删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      activeTab: 'all',
      gradeFilter: '',
      gradeFilterIndex: 0,
      gradeOptions: ['全部年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'],
      sortIndex: 0,
      sortOptions: ['按创建时间', '按姓名', '按学号', '按年级'],
      loading: false,
      students: [],
      classes: [],
      // 添加总数和分页信息
      studentsTotal: 0,
      classesTotal: 0,
      studentsPage: 1,
      classesPage: 1,
      hasMoreStudents: true,
      hasMoreClasses: true,
      // 分页显示控制
      showStudentsPagination: false,
      showClassesPagination: false,
      studentsPageSize: 20,
      classesPageSize: 20,
      isEditMode: false,
      selectedItems: [],
      showDeleteModal: false,
      deleteMessage: '',
      deleteTarget: null,
      deleteType: '',
      // 本地缓存机制 - 存储所有数据
      localCache: {
        allStudents: [], // 所有学生数据
        allClasses: [], // 所有班级数据
        lastLoadTime: null,
        isLoaded: false, // 是否已加载全量数据
        isLoadingBackground: false, // 是否正在后台加载
        backgroundLoadProgress: 0, // 后台加载进度
        // 分批缓存
        studentsBatches: [], // 存储学生数据批次 [batch1, batch2, batch3...]
        classesBatches: [],  // 存储班级数据批次 [batch1, batch2, batch3...]
        studentsBatchSize: 50, // 每批50条数据
        classesBatchSize: 50,
        studentsTotalBatches: 0, // 总批次数
        classesTotalBatches: 0,
        currentStudentsBatch: 0, // 当前加载到第几批
        currentClassesBatch: 0
      }
    }
  },
  computed: {
    // 计算学生总页数
    studentsTotalPages() {
      const totalPages = Math.ceil(this.studentsTotal / this.studentsPageSize);
      console.log('计算学生总页数:', this.studentsTotal, '/', this.studentsPageSize, '=', totalPages);
      return totalPages;
    },
    
    // 计算班级总页数
    classesTotalPages() {
      return Math.ceil(this.classesTotal / this.classesPageSize);
    },
    
    filteredStudents() {
      let filtered = this.localCache.allStudents || [];
      
      // 年级过滤
      if (this.gradeFilter && this.gradeFilter !== '全部年级') {
        filtered = filtered.filter(student => student.grade === this.gradeFilter);
      }
      
      // 排序
      return this.sortData(filtered);
    },
    filteredClasses() {
      let filtered = this.localCache.allClasses || [];
      
      // 年级过滤
      if (this.gradeFilter && this.gradeFilter !== '全部年级') {
        filtered = filtered.filter(classItem => classItem.grade === this.gradeFilter);
      }
      
      // 排序
      return this.sortData(filtered);
    },
    // 分页后的学生数据
    paginatedStudents() {
      const startIndex = (this.studentsPage - 1) * this.studentsPageSize;
      const endIndex = startIndex + this.studentsPageSize;
      return this.filteredStudents.slice(startIndex, endIndex);
    },
    // 分页后的班级数据
    paginatedClasses() {
      const startIndex = (this.classesPage - 1) * this.classesPageSize;
      const endIndex = startIndex + this.classesPageSize;
      return this.filteredClasses.slice(startIndex, endIndex);
    },
    isAllSelected() {
      const currentItems = this.activeTab === 'students' ? this.paginatedStudents : 
                          this.activeTab === 'classes' ? this.paginatedClasses : 
                          [...this.paginatedStudents, ...this.paginatedClasses];
      return currentItems.length > 0 && this.selectedItems.length === currentItems.length;
    }
  },
  onLoad() {
    // 直接加载数据，不使用缓存
    this.loadData();
  },
  onShow() {
    // 直接加载数据，不使用缓存
    this.loadData();
  },
  
  onReady() {
    // 不再使用缓存，无需注册全局方法
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onSearchInput() {
      // 搜索防抖处理
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    
    performSearch() {
      if (!this.searchKeyword.trim()) {
        // 如果搜索关键词为空，重新应用筛选条件
        this.applyFilters();
        return;
      }
      
      // 使用本地缓存进行搜索
      const keyword = this.searchKeyword.toLowerCase().trim();
      
      // 搜索学生
      if (this.activeTab === 'students' || this.activeTab === 'all') {
        let searchStudents = this.localCache.allStudents.filter(student => 
          student.name.toLowerCase().includes(keyword) ||
          student.studentId.toLowerCase().includes(keyword) ||
          student.school?.toLowerCase().includes(keyword)
        );
        
        // 应用年级筛选
        if (this.gradeFilter && this.gradeFilter !== '全部年级') {
          searchStudents = searchStudents.filter(student => student.grade === this.gradeFilter);
        }
        
        // 应用分页：只显示当前页的搜索结果
        const startIndex = (this.studentsPage - 1) * this.studentsPageSize;
        const endIndex = startIndex + this.studentsPageSize;
        this.students = searchStudents.slice(startIndex, endIndex);
        // 搜索时保持数据库中的真实总数，不修改 studentsTotal
      }
      
      // 搜索班级
      if (this.activeTab === 'classes' || this.activeTab === 'all') {
        let searchClasses = this.localCache.allClasses.filter(classItem => 
          classItem.className.toLowerCase().includes(keyword) ||
          classItem.classCode.toLowerCase().includes(keyword) ||
          classItem.teacherName.toLowerCase().includes(keyword)
        );
        
        // 应用年级筛选
        if (this.gradeFilter && this.gradeFilter !== '全部年级') {
          searchClasses = searchClasses.filter(classItem => classItem.grade === this.gradeFilter);
        }
        
        // 应用分页：只显示当前页的搜索结果
        const classStartIndex = (this.classesPage - 1) * this.classesPageSize;
        const classEndIndex = classStartIndex + this.classesPageSize;
        this.classes = searchClasses.slice(classStartIndex, classEndIndex);
        // 搜索时保持数据库中的真实总数，不修改 classesTotal
      }
    },
    clearSearch() {
      this.searchKeyword = '';
      // 清空搜索时重新应用筛选条件
      this.performSearch();
    },
    switchTab(tab) {
      this.activeTab = tab;
      
      // 切换标签页时，重新应用筛选条件
      this.applyFilters();
    },
    onGradeFilterChange(e) {
      this.gradeFilterIndex = e.detail.value;
      this.gradeFilter = this.gradeOptions[e.detail.value];
      
      // 年级筛选变化时，重置分页到第一页
      this.studentsPage = 1;
      this.classesPage = 1;
      
      // 直接应用筛选条件（使用缓存数据）
      this.applyFilters();
    },
    onSortChange(e) {
      this.sortIndex = e.detail.value;
    },
    sortData(data) {
      const sortType = this.sortOptions[this.sortIndex];
      return data.sort((a, b) => {
        switch (sortType) {
          case '按创建时间':
            return new Date(b.createTime) - new Date(a.createTime);
          case '按姓名':
            return a.name.localeCompare(b.name);
          case '按学号':
            return a.studentId?.localeCompare(b.studentId) || 0;
          case '按年级':
            return a.grade.localeCompare(b.grade);
          default:
            return 0;
        }
      });
    },
    async loadData() {
      this.loading = true;
      try {
        console.log('开始加载数据（直接读取数据库）');
        
        // 直接加载学生和班级数据
        const studentsResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: 1000 // 获取所有学生
          }
        });
        
        const classesResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: 1000 // 获取所有班级
          }
        });
        
        if (studentsResult.result.code === 0) {
          this.localCache.allStudents = studentsResult.result.data || [];
          this.studentsTotal = studentsResult.result.total || 0;
          console.log('学生数据加载成功，数量:', this.localCache.allStudents.length);
          console.log('学生数据详情:', this.localCache.allStudents);
        } else {
          console.error('学生数据加载失败:', studentsResult.result.message);
        }
        
        if (classesResult.result.code === 0) {
          this.localCache.allClasses = classesResult.result.data || [];
          this.classesTotal = classesResult.result.total || 0;
          console.log('班级数据加载成功，数量:', this.localCache.allClasses.length);
          console.log('班级数据详情:', this.localCache.allClasses);
        } else {
          console.error('班级数据加载失败:', classesResult.result.message);
        }
        
        // 应用筛选条件
        this.applyFilters();
        
      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载数据失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 从本地缓存加载数据
    loadFromCache() {
      console.log('从缓存加载数据');
      console.log('学生批次数据:', this.localCache.studentsBatches);
      console.log('班级批次数据:', this.localCache.classesBatches);
      
      // 合并所有批次数据
      this.localCache.allStudents = this.localCache.studentsBatches.flat();
      this.localCache.allClasses = this.localCache.classesBatches.flat();
      
      console.log('合并后学生数据:', this.localCache.allStudents.length, '条');
      console.log('合并后班级数据:', this.localCache.allClasses.length, '条');
      
      // 应用当前筛选条件
      this.applyFilters();
      
      console.log('缓存数据加载完成，学生:', this.students.length, '班级:', this.classes.length);
    },
    
    // 保存缓存数据到本地存储
    saveCacheToStorage() {
      try {
        const cacheData = {
          studentsBatches: this.localCache.studentsBatches,
          classesBatches: this.localCache.classesBatches,
          studentsTotal: this.studentsTotal,
          classesTotal: this.classesTotal,
          lastLoadTime: this.localCache.lastLoadTime,
          isLoaded: this.localCache.isLoaded,
          // 保存分页信息
          studentsPage: this.studentsPage,
          classesPage: this.classesPage,
          hasMoreStudents: this.hasMoreStudents,
          hasMoreClasses: this.hasMoreClasses,
          showStudentsPagination: this.showStudentsPagination,
          showClassesPagination: this.showClassesPagination
        };
        uni.setStorageSync('archive_cache', cacheData);
        console.log('缓存数据已保存到本地存储');
      } catch (error) {
        console.error('保存缓存数据失败:', error);
      }
    },
    
    // 从本地存储加载缓存数据
    loadCacheFromStorage() {
      try {
        const cacheData = uni.getStorageSync('archive_cache');
        if (cacheData && cacheData.studentsBatches && cacheData.studentsBatches.length > 0) {
          this.localCache.studentsBatches = cacheData.studentsBatches;
          this.localCache.classesBatches = cacheData.classesBatches || [];
          this.studentsTotal = cacheData.studentsTotal || 0;
          this.classesTotal = cacheData.classesTotal || 0;
          this.localCache.lastLoadTime = cacheData.lastLoadTime;
          this.localCache.isLoaded = cacheData.isLoaded;
          
          // 设置分页信息
          this.studentsPage = cacheData.studentsPage || 1;
          this.classesPage = cacheData.classesPage || 1;
          this.hasMoreStudents = cacheData.hasMoreStudents !== undefined ? cacheData.hasMoreStudents : (this.studentsTotal > this.studentsPageSize);
          this.hasMoreClasses = cacheData.hasMoreClasses !== undefined ? cacheData.hasMoreClasses : (this.classesTotal > this.classesPageSize);
          this.showStudentsPagination = cacheData.showStudentsPagination !== undefined ? cacheData.showStudentsPagination : (this.studentsTotal > 0);
          this.showClassesPagination = cacheData.showClassesPagination !== undefined ? cacheData.showClassesPagination : (this.classesTotal > 0);
          
          console.log('从本地存储加载缓存数据成功');
          console.log('学生批次:', this.localCache.studentsBatches.length);
          console.log('班级批次:', this.localCache.classesBatches.length);
          console.log('分页信息设置:', {
            studentsTotal: this.studentsTotal,
            classesTotal: this.classesTotal,
            showStudentsPagination: this.showStudentsPagination,
            showClassesPagination: this.showClassesPagination,
            hasMoreStudents: this.hasMoreStudents,
            hasMoreClasses: this.hasMoreClasses
          });
          return true;
        }
      } catch (error) {
        console.error('从本地存储加载缓存数据失败:', error);
      }
      return false;
    },
    
    // 更新本地缓存（当有新数据录入时调用）
    async updateLocalCache() {
      try {
        console.log('开始更新本地缓存');
        
        // 获取最新的学生和班级数据
        const studentsResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: this.localCache.studentsBatchSize
          }
        });
        
        const classesResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: this.localCache.classesBatchSize
          }
        });
        
        if (studentsResult.result.code === 0) {
          const newStudents = studentsResult.result.data || [];
          this.localCache.studentsBatches[0] = newStudents;
          this.studentsTotal = studentsResult.result.total || 0;
          console.log('学生缓存已更新:', newStudents.length, '条');
        }
        
        if (classesResult.result.code === 0) {
          const newClasses = classesResult.result.data || [];
          this.localCache.classesBatches[0] = newClasses;
          this.classesTotal = classesResult.result.total || 0;
          console.log('班级缓存已更新:', newClasses.length, '条');
        }
        
        // 更新分页信息
        this.hasMoreStudents = this.studentsTotal > this.studentsPageSize;
        this.hasMoreClasses = this.classesTotal > this.classesPageSize;
        this.showStudentsPagination = this.studentsTotal > 0;
        this.showClassesPagination = this.classesTotal > 0;
        
        // 保存更新后的缓存
        this.saveCacheToStorage();
        
        // 重新加载显示数据
        this.loadFromCache();
        
        console.log('本地缓存更新完成');
        
      } catch (error) {
        console.error('更新本地缓存失败:', error);
      }
    },
    
    // 添加新班级到本地缓存
    addClassToLocalCache(newClassData) {
      try {
        console.log('添加新班级到本地缓存:', newClassData);
        
        if (newClassData && newClassData.classId) {
          const newClass = {
            _id: newClassData.classId,
            className: newClassData.className || '未命名班级',
            grade: newClassData.grade || '',
            subject: newClassData.subject || '',
            headTeacher: newClassData.headTeacher || '',
            headTeacherId: newClassData.headTeacherId || '',
            school: newClassData.school || '默认学校',
            students: [],
            studentIds: [],
            studentCount: 0,
            status: 'active',
            createTime: newClassData.createTime || new Date().toISOString(),
            updateTime: newClassData.updateTime || new Date().toISOString()
          };
          
          // 添加到本地缓存
          this.localCache.allClasses.push(newClass);
          this.localCache.classesBatches[0].push(newClass);
          this.classesTotal = this.localCache.allClasses.length;
          
          // 更新分页信息
          this.hasMoreClasses = this.classesTotal > this.classesPageSize;
          this.showClassesPagination = this.classesTotal > 0;
          
          // 保存到本地存储
          this.saveCacheToStorage();
          
          // 重新加载显示数据
          this.loadFromCache();
          
          console.log('新班级已添加到本地缓存:', newClass.className);
        }
      } catch (error) {
        console.error('添加新班级到本地缓存失败:', error);
      }
    },
    
    // 加载第一批数据（0-50条）
    async loadFirstBatchData() {
      try {
        console.log('开始加载第一批数据（0-50条）');
        
        // 获取学生总数和班级总数
        const studentsCountResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: 1 // 只获取总数
          }
        });
        
        const classesCountResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: 1 // 只获取总数
          }
        });
        
        if (studentsCountResult.result.code === 0) {
          this.studentsTotal = studentsCountResult.result.total || 0;
          this.localCache.studentsTotalBatches = Math.ceil(this.studentsTotal / this.localCache.studentsBatchSize);
          console.log('学生总数:', this.studentsTotal, '总批次数:', this.localCache.studentsTotalBatches);
        }
        
        if (classesCountResult.result.code === 0) {
          this.classesTotal = classesCountResult.result.total || 0;
          this.localCache.classesTotalBatches = Math.ceil(this.classesTotal / this.localCache.classesBatchSize);
          console.log('班级总数:', this.classesTotal, '总批次数:', this.localCache.classesTotalBatches);
        }
        
        // 加载第一批学生数据（0-50条）
        const studentsResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: this.localCache.studentsBatchSize
          }
        });
        
        // 加载第一批班级数据（0-50条）
        const classesResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: this.localCache.classesBatchSize
          }
        });
        
        if (studentsResult.result.code === 0) {
          const firstBatchStudents = studentsResult.result.data || [];
          // 确保批次数组存在
          if (!this.localCache.studentsBatches) {
            this.localCache.studentsBatches = [];
          }
          this.localCache.studentsBatches[0] = firstBatchStudents;
          this.localCache.currentStudentsBatch = 1;
          console.log('第一批学生数据加载完成:', firstBatchStudents.length, '条');
          console.log('学生批次数组:', this.localCache.studentsBatches);
        }
        
        if (classesResult.result.code === 0) {
          const firstBatchClasses = classesResult.result.data || [];
          // 确保批次数组存在
          if (!this.localCache.classesBatches) {
            this.localCache.classesBatches = [];
          }
          this.localCache.classesBatches[0] = firstBatchClasses;
          this.localCache.currentClassesBatch = 1;
          console.log('第一批班级数据加载完成:', firstBatchClasses.length, '条');
          console.log('班级批次数组:', this.localCache.classesBatches);
        }
        
        // 立即显示第一批数据
        this.loadFromCache();
        
        // 设置分页信息
        this.studentsPage = 1;
        this.classesPage = 1;
        this.hasMoreStudents = this.localCache.currentStudentsBatch < this.localCache.studentsTotalBatches;
        this.hasMoreClasses = this.localCache.currentClassesBatch < this.localCache.classesTotalBatches;
        this.showStudentsPagination = this.studentsTotal > 0;
        this.showClassesPagination = this.classesTotal > 0;
        
        console.log('第一批数据加载完成，开始显示');
        
      } catch (error) {
        console.error('加载第一批数据失败:', error);
        throw error;
      }
    },
    
    // 后台加载剩余批次数据
    async loadRemainingBatchesInBackground() {
      try {
        console.log('开始后台加载剩余批次数据');
        this.localCache.isLoadingBackground = true;
        this.localCache.backgroundLoadProgress = 0;
        
        const totalBatches = this.localCache.studentsTotalBatches + this.localCache.classesTotalBatches;
        let loadedBatches = 0;
        
        // 加载剩余学生数据批次
        for (let batchIndex = 1; batchIndex < this.localCache.studentsTotalBatches; batchIndex++) {
          try {
            const page = batchIndex + 1; // 第2页开始
            const result = await uniCloud.callFunction({
              name: 'archive-manager',
              data: {
                action: 'getStudents',
                page: page,
                pageSize: this.localCache.studentsBatchSize
              }
            });
            
            if (result.result.code === 0) {
              const batchData = result.result.data || [];
              // 确保批次数组存在
              if (!this.localCache.studentsBatches) {
                this.localCache.studentsBatches = [];
              }
              this.localCache.studentsBatches[batchIndex] = batchData;
              this.localCache.currentStudentsBatch = batchIndex + 1;
              console.log(`学生数据第${batchIndex + 1}批加载完成:`, batchData.length, '条');
              console.log('学生批次数组更新:', this.localCache.studentsBatches);
            }
            
            loadedBatches++;
            this.localCache.backgroundLoadProgress = Math.round((loadedBatches / totalBatches) * 100);
            
            // 保存更新后的缓存数据到本地存储
            this.saveCacheToStorage();
            
            // 添加小延迟，避免请求过于频繁
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`加载学生数据第${batchIndex + 1}批失败:`, error);
          }
        }
        
        // 加载剩余班级数据批次
        for (let batchIndex = 1; batchIndex < this.localCache.classesTotalBatches; batchIndex++) {
          try {
            const page = batchIndex + 1; // 第2页开始
            const result = await uniCloud.callFunction({
              name: 'archive-manager',
              data: {
                action: 'getClasses',
                page: page,
                pageSize: this.localCache.classesBatchSize
              }
            });
            
            if (result.result.code === 0) {
              const batchData = result.result.data || [];
              // 确保批次数组存在
              if (!this.localCache.classesBatches) {
                this.localCache.classesBatches = [];
              }
              this.localCache.classesBatches[batchIndex] = batchData;
              this.localCache.currentClassesBatch = batchIndex + 1;
              console.log(`班级数据第${batchIndex + 1}批加载完成:`, batchData.length, '条');
              console.log('班级批次数组更新:', this.localCache.classesBatches);
            }
            
            loadedBatches++;
            this.localCache.backgroundLoadProgress = Math.round((loadedBatches / totalBatches) * 100);
            
            // 保存更新后的缓存数据到本地存储
            this.saveCacheToStorage();
            
            // 添加小延迟，避免请求过于频繁
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`加载班级数据第${batchIndex + 1}批失败:`, error);
          }
        }
        
        this.localCache.backgroundLoadProgress = 100;
        console.log('所有批次数据加载完成');
        
        // 后台加载完成后更新显示数据
        this.loadFromCache();
        
      } catch (error) {
        console.error('后台加载剩余批次数据失败:', error);
      } finally {
        this.localCache.isLoadingBackground = false;
      }
    },
    
    
    
    // 应用筛选条件
    applyFilters() {
      console.log('开始应用筛选条件');
      console.log('localCache.allStudents:', this.localCache.allStudents?.length || 0);
      console.log('localCache.allClasses:', this.localCache.allClasses?.length || 0);
      
      // 更新总数（用于分页计算）
      this.studentsTotal = this.filteredStudents.length;
      this.classesTotal = this.filteredClasses.length;
      
      console.log('筛选后学生总数:', this.studentsTotal);
      console.log('筛选后班级总数:', this.classesTotal);
      console.log('分页后学生数据:', this.paginatedStudents.length);
      console.log('分页后班级数据:', this.paginatedClasses.length);
      
      // 更新分页信息
      this.hasMoreStudents = this.studentsTotal > this.studentsPageSize;
      this.hasMoreClasses = this.classesTotal > this.classesPageSize;
      this.showStudentsPagination = this.studentsTotal > 0;
      this.showClassesPagination = this.classesTotal > 0;
      
      console.log('筛选完成 - 学生总数:', this.studentsTotal, '班级总数:', this.classesTotal);
      console.log('学生页数:', this.studentsPage, '班级页数:', this.classesPage);
      console.log('显示学生分页:', this.showStudentsPagination, '显示班级分页:', this.showClassesPagination);
    },
    
    // 添加新学生到本地缓存
    addStudentToCache(student) {
      this.localCache.allStudents.push(student);
      this.applyFilters();
    },
    
    // 添加新班级到本地缓存
    addClassToCache(classItem) {
      this.localCache.allClasses.push(classItem);
      this.applyFilters();
    },
    
    // 从本地缓存删除学生
    removeStudentFromCache(studentId) {
      this.localCache.allStudents = this.localCache.allStudents.filter(s => s.studentId !== studentId);
      this.applyFilters();
    },
    
    // 从本地缓存删除班级
    removeClassFromCache(classId) {
      this.localCache.allClasses = this.localCache.allClasses.filter(c => c._id !== classId);
      this.applyFilters();
    },
    
    // 刷新本地缓存（重新从数据库加载）
    async refreshCache() {
      this.localCache.isLoaded = false;
      await this.loadAllData();
    },
    
    // 加载指定页的学生数据（使用本地缓存）
    loadStudentsPage(page) {
      this.studentsPage = page;
      this.hasMoreStudents = this.studentsPage < Math.ceil(this.studentsTotal / this.studentsPageSize);
      
      // 使用本地缓存数据应用筛选和分页
      this.applyFilters();
      
      console.log(`切换到第${page}页学生数据:`, this.students.length, '条');
    },
    
    // 加载指定页的班级数据（使用本地缓存）
    loadClassesPage(page) {
      this.classesPage = page;
      this.hasMoreClasses = this.classesPage < Math.ceil(this.classesTotal / this.classesPageSize);
      
      // 使用本地缓存数据应用筛选和分页
      this.applyFilters();
      
      console.log(`切换到第${page}页班级数据:`, this.classes.length, '条');
    },
    
    // 上一页
    prevPage(type) {
      if (type === 'students' && this.studentsPage > 1) {
        this.loadStudentsPage(this.studentsPage - 1);
      } else if (type === 'classes' && this.classesPage > 1) {
        this.loadClassesPage(this.classesPage - 1);
      }
    },
    
    // 下一页
    nextPage(type) {
      if (type === 'students') {
        if (this.hasMoreStudents) {
          this.loadStudentsPage(this.studentsPage + 1);
        } else {
          uni.showToast({
            title: '当前已是最后一页',
            icon: 'none',
            duration: 1500
          });
        }
      } else if (type === 'classes') {
        if (this.hasMoreClasses) {
          this.loadClassesPage(this.classesPage + 1);
        } else {
          uni.showToast({
            title: '当前已是最后一页',
            icon: 'none',
            duration: 1500
          });
        }
      }
    },
    
    
    navigateToStudentDetail(student) {
      uni.navigateTo({
        url: `/pages/student-detail/student-detail?studentId=${student.studentId}`
      });
    },
    navigateToClassDetail(classItem) {
      uni.navigateTo({
        url: `/pages/class-detail/class-detail?classId=${classItem._id}`
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    // 编辑模式相关方法
    enterEditMode() {
      this.isEditMode = true;
      this.selectedItems = [];
    },
    exitEditMode() {
      this.isEditMode = false;
      this.selectedItems = [];
    },
    toggleSelectAll() {
      const currentItems = this.activeTab === 'students' ? this.filteredStudents : 
                          this.activeTab === 'classes' ? this.filteredClasses : 
                          [...this.filteredStudents, ...this.filteredClasses];
      
      if (this.isAllSelected) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [...currentItems];
      }
    },
    isStudentSelected(student) {
      return this.selectedItems.some(item => item._id === student._id);
    },
    isClassSelected(classItem) {
      return this.selectedItems.some(item => item._id === classItem._id);
    },
    toggleStudentSelection(student) {
      const index = this.selectedItems.findIndex(item => item._id === student._id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(student);
      }
    },
    toggleClassSelection(classItem) {
      const index = this.selectedItems.findIndex(item => item._id === classItem._id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(classItem);
      }
    },
    // 删除相关方法
    showDeleteConfirm(item, type) {
      this.deleteTarget = item;
      this.deleteType = type;
      this.deleteMessage = `确定要删除${type === 'student' ? '学生' : '班级'} "${item.name || item.className}" 吗？`;
      this.showDeleteModal = true;
    },
    showBatchDeleteConfirm() {
      if (this.selectedItems.length === 0) return;
      
      this.deleteTarget = this.selectedItems;
      this.deleteType = 'batch';
      this.deleteMessage = `确定要删除选中的 ${this.selectedItems.length} 项吗？`;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
      this.deleteType = '';
      this.deleteMessage = '';
    },
    async confirmDelete() {
      try {
        if (this.deleteType === 'batch') {
          await this.batchDelete();
        } else {
          await this.singleDelete();
        }
        this.closeDeleteModal();
        this.loadData(); // 重新加载数据
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('删除失败:', error);
        uni.showToast({
          title: '删除失败',
          icon: 'error'
        });
      }
    },
    async singleDelete() {
      const { deleteTarget, deleteType } = this;
      
      if (deleteType === 'student') {
        await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'deleteStudent',
            studentId: deleteTarget.studentId
          }
        });
      } else if (deleteType === 'class') {
        await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'deleteClass',
            classId: deleteTarget._id
          }
        });
      }
    },
    async batchDelete() {
      const students = this.selectedItems.filter(item => this.students.some(s => s._id === item._id));
      const classes = this.selectedItems.filter(item => this.classes.some(c => c._id === item._id));
      
      // 批量删除学生
      if (students.length > 0) {
        await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'batchDeleteStudents',
            studentIds: students.map(s => s.studentId)
          }
        });
      }
      
      // 批量删除班级
      if (classes.length > 0) {
        await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'batchDeleteClasses',
            classIds: classes.map(c => c._id)
          }
        });
      }
      
      this.selectedItems = [];
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f8f8f8;
  min-height: 100vh;
  padding-top: 120rpx;
  /* 为底部工具栏留出空间 */
  padding-bottom: 120rpx;
}

/* 自定义导航栏样式 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  padding-top: var(--status-bar-height, 0);
}

.navbar-left {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  margin-right: 8rpx;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: #333;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.navbar-right {
  width: 100rpx;
}

/* 搜索栏样式 */
.search-container {
  margin-bottom: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 15rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 24rpx;
  color: #999;
}

/* 分类标签样式 */
.category-tabs {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.category-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.category-tab.active {
  background: #4FC3F7;
  color: #fff;
  font-weight: bold;
}

/* 批量操作工具栏样式 - 固定在底部 */
.batch-toolbar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #e5e5e5;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
  /* 为底部工具栏留出空间 */
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.select-all-btn {
  padding: 10rpx 20rpx;
  background: #4FC3F7;
  color: #fff;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.selected-count {
  font-size: 26rpx;
  color: #666;
}

.toolbar-right {
  display: flex;
  gap: 15rpx;
}

.batch-delete-btn,
.exit-edit-btn {
  padding: 10rpx 20rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  border: none;
}

.batch-delete-btn {
  background: #ff6b6b;
  color: #fff;
}

.batch-delete-btn:disabled {
  background: #ccc;
}

.exit-edit-btn {
  background: #4FC3F7;
  color: #fff;
}

/* 编辑模式切换按钮 */
.edit-mode-toggle {
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  z-index: 100;
}

.edit-mode-btn {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.edit-mode-btn:active {
  transform: scale(0.95);
}

.edit-icon {
  width: 100rpx;
  height: 100rpx;
}

/* 筛选条件样式 */
.filter-container {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 26rpx;
  color: #333;
  margin-right: 10rpx;
  min-width: 100rpx;
}

.filter-picker {
  flex: 1;
  padding: 15rpx 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-arrow {
  font-size: 20rpx;
  color: #999;
}

/* 数据容器样式 */
.data-container {
  margin-bottom: 20rpx;
}

.loading-container {
  text-align: center;
  padding: 60rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 分组样式 */
.section {
  margin-bottom: 30rpx;
}

.section-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

/* 学生卡片样式 */
.student-list {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.student-card {
  display: flex;
  align-items: center;
  padding: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s;
}

.student-card:last-child {
  border-bottom: none;
}

.student-card.selected {
  background: #f0f8ff;
  border-left: 4rpx solid #4FC3F7;
}

/* 选择框样式 */
.selection-checkbox {
  margin-right: 20rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.checkbox.checked {
  background: #4FC3F7;
  border-color: #4FC3F7;
}

.check-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

/* 编辑操作按钮 */
.edit-actions {
  display: flex;
  gap: 10rpx;
}

.delete-btn {
  padding: 8rpx 16rpx;
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 6rpx;
  font-size: 22rpx;
}

.student-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #4FC3F7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.student-info {
  flex: 1;
}

.student-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.student-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 15rpx;
}

.student-id {
  font-size: 24rpx;
  color: #4FC3F7;
  background: #f0f8ff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.student-details {
  margin-bottom: 8rpx;
}

.student-grade,
.student-subjects,
.student-school {
  font-size: 24rpx;
  color: #666;
  margin-right: 15rpx;
}

.student-meta {
  display: flex;
  align-items: center;
}

.create-time,
.create-by {
  font-size: 22rpx;
  color: #999;
  margin-right: 15rpx;
}

.student-actions {
  margin-left: 15rpx;
}

.action-icon {
  font-size: 28rpx;
  color: #ccc;
}

/* 班级卡片样式 */
.class-list {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.class-card {
  display: flex;
  align-items: center;
  padding: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s;
}

.class-card:last-child {
  border-bottom: none;
}

.class-card.selected {
  background: #f0f8ff;
  border-left: 4rpx solid #4FC3F7;
}

.class-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: #9C27B0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.class-icon-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

.class-info {
  flex: 1;
}

.class-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.class-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 15rpx;
}

.class-code {
  font-size: 24rpx;
  color: #9C27B0;
  background: #f3e5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.class-details {
  margin-bottom: 8rpx;
}

.class-grade,
.class-teacher,
.class-student-count {
  font-size: 24rpx;
  color: #666;
  margin-right: 15rpx;
}

.class-meta {
  display: flex;
  align-items: center;
}

.class-actions {
  margin-left: 15rpx;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80rpx 0;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 后台加载进度指示器样式 */
.background-loading-indicator {
  background: #f0f8ff;
  border: 1rpx solid #e3f2fd;
  border-radius: 8rpx;
  margin: 20rpx;
  padding: 20rpx;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  color: #1976d2;
  font-size: 24rpx;
  margin-bottom: 10rpx;
}

.progress-bar {
  width: 100%;
  height: 6rpx;
  background: #e0e0e0;
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

/* 分页控件样式 */
.pagination-container {
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  border-radius: 8rpx;
  margin: 20rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  flex: 1;
}

.pagination-text {
  color: #666;
  font-size: 26rpx;
}

.pagination-buttons {
  display: flex;
  gap: 20rpx;
}

.pagination-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6rpx;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  min-width: 120rpx;
}

.pagination-btn:disabled {
  background: #ccc;
  color: #999;
}

.pagination-btn:not(:disabled):active {
  background: #0056b3;
}


/* 删除确认弹窗样式 */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.delete-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-width: 600rpx;
  overflow: hidden;
}

.delete-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.delete-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.delete-body {
  padding: 30rpx;
  text-align: center;
}

.delete-message {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.delete-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.cancel-delete-btn,
.confirm-delete-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}

.cancel-delete-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-delete-btn {
  background: #ff6b6b;
  color: #fff;
}
</style>
