<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">学生详情</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <view class="form-container" v-if="studentData">
      <view class="form-item">
        <text class="label">学生姓名 *</text>
        <input 
          class="input" 
          v-model="studentData.name" 
          placeholder="请输入学生姓名"
          maxlength="20"
        />
      </view>
      
      <view class="form-item">
        <text class="label">年级 *</text>
        <picker 
          mode="selector" 
          :value="gradeIndex" 
          :range="gradeOptions" 
          @change="onGradeChange"
        >
          <view class="picker">
            {{ studentData.grade || '请选择年级' }}
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">所学科目 *</text>
        <view class="subject-selector" @click="showSubjectModal">
          <view class="subject-display">
            <text v-if="studentData.subjects.length === 0" class="placeholder">请选择科目</text>
            <view v-else class="selected-subjects">
              <view 
                v-for="(subject, index) in studentData.subjects" 
                :key="index"
                class="subject-tag"
              >
                <text class="subject-text">{{ subject }}</text>
                <text class="remove-btn" @click.stop="removeSubject(index)">×</text>
              </view>
            </view>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">学校</text>
        <input 
          class="input" 
          v-model="studentData.school" 
          placeholder="请输入学校名称（可选）"
          maxlength="50"
        />
      </view>
      
      <view class="form-item">
        <text class="label">加入班级</text>
        <view class="class-selector" @click="showClassModal">
          <view class="class-display">
            <text v-if="studentData.classes.length === 0" class="placeholder">请选择班级（可选）</text>
            <view v-else class="selected-classes">
              <view 
                v-for="(classItem, index) in studentData.classes" 
                :key="index"
                class="class-tag"
              >
                <text class="class-text">{{ classItem.className }}</text>
                <text class="remove-btn" @click.stop="removeClass(index)">×</text>
              </view>
            </view>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
    </view>
    
    <!-- 保存按钮 -->
    <view class="save-button-container">
      <button class="save-button" @click="saveStudentInfo">保存修改</button>
    </view>
    
    <!-- 学习课程和考试成绩 -->
    <view class="academic-section" v-if="studentData">
      <view class="tabs">
        <view 
          class="tab" 
          :class="{ active: activeTab === 'courses' }"
          @click="switchTab('courses')"
        >
          学习课程
        </view>
        <view 
          class="tab" 
          :class="{ active: activeTab === 'scores' }"
          @click="switchTab('scores')"
        >
          考试成绩
        </view>
      </view>
      
      <!-- 学习课程列表 -->
      <view v-if="activeTab === 'courses'" class="content">
        <view v-if="courses.length === 0" class="empty-state">
          <text class="empty-text">暂无课程记录</text>
        </view>
        
        <view v-else class="course-list">
          <view 
            v-for="(course, index) in courses" 
            :key="index"
            class="course-item"
          >
            <view class="course-header">
              <text class="course-name">{{ course.courseName }}</text>
              <text class="course-year">{{ course.year }} {{ course.semester }}</text>
            </view>
            <view class="course-details">
              <text class="status">状态：{{ course.status }}</text>
              <text class="enroll-date">入学时间：{{ formatDate(course.enroll_date) }}</text>
              <text v-if="course.completion_date" class="completion-date">结业时间：{{ formatDate(course.completion_date) }}</text>
              <!-- 显示班级信息 -->
              <text v-if="course.className" class="class-info">班级：{{ course.className }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 考试成绩列表 -->
      <view v-if="activeTab === 'scores'" class="content">
        <view v-if="scores.length === 0" class="empty-state">
          <text class="empty-text">暂无成绩记录</text>
        </view>
        
        <view v-else class="score-list">
          <view 
            v-for="(score, index) in scores" 
            :key="index"
            class="score-item"
            @click="editScore(score, index)"
          >
            <view class="score-header">
              <text class="course-name">{{ score.courseName }}</text>
              <text class="exam-name">{{ score.exam_name }}</text>
            </view>
            <view class="score-details">
              <text class="score-value">成绩：{{ score.score }}分</text>
              <text class="exam-date">考试时间：{{ formatDate(score.exam_date) }}</text>
              <text v-if="score.remark" class="remark">备注：{{ score.remark }}</text>
              <!-- 显示科目信息 -->
              <text class="subject-info">科目：{{ getSubjectByCourseId(score.course_id) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 删除学生按钮 - 右下角浮动按钮 -->
    <view class="delete-button-container">
      <image 
        src="/static/删除 .png" 
        class="delete-button-image" 
        @click="deleteStudent"
        mode="aspectFit"
      />
    </view>
    
    <!-- 科目选择弹窗 -->
    <view v-if="showSubjectModalFlag" class="subject-modal" @click="closeSubjectModal">
      <view class="subject-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择科目</text>
          <view class="close-btn" @click="closeSubjectModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="subject-grid">
            <view 
              v-for="subject in allSubjects" 
              :key="subject"
              class="subject-item"
              :class="{selected: tempSubjects.includes(subject)}"
              @click="toggleSubject(subject)"
            >
              <text class="subject-name">{{ subject }}</text>
              <text v-if="tempSubjects.includes(subject)" class="check-icon">✓</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeSubjectModal">取消</button>
          <button class="confirm-btn" @click="confirmSubjects">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 班级选择弹窗 -->
    <view v-if="showClassModalFlag" class="class-modal" @click="closeClassModal">
      <view class="class-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择班级</text>
          <view class="close-btn" @click="closeClassModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <!-- 添加搜索框 -->
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="classSearchKeyword" 
              placeholder="搜索班级名称或年级" 
              @input="onClassSearchInput"
            />
          </view>
          
          <!-- 添加提示信息 -->
          <view class="search-tip" v-if="!classSearchKeyword">
            <text class="tip-text">输入关键字搜索班级，或滑动查看所有班级</text>
          </view>
          
          <view class="class-grid">
            <view 
              v-for="classItem in filteredClasses" 
              :key="classItem._id"
              class="class-item"
              :class="{selected: isClassSelected(classItem)}"
              @click="toggleClass(classItem)"
            >
              <view class="class-info">
                <text class="class-name">{{ classItem.className }}</text>
                <text class="class-grade">{{ classItem.grade }}</text>
                <text class="class-teacher">班主任：{{ classItem.teacherName }}</text>
              </view>
              <text v-if="isClassSelected(classItem)" class="check-icon">✓</text>
            </view>
            
            <!-- 当搜索结果为空且有输入关键字时，显示创建新班级选项 -->
            <view 
              v-if="classSearchKeyword && filteredClasses.length === 0" 
              class="create-class-item"
              @click="createNewClass"
            >
              <text class="create-text">创建新班级 "{{ classSearchKeyword }}"</text>
            </view>
            
            <!-- 当没有班级时显示提示 -->
            <view v-if="filteredClasses.length === 0 && !classSearchKeyword" class="empty-class-tip">
              <text class="empty-text">暂无班级信息</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeClassModal">取消</button>
          <button class="confirm-btn" @click="confirmClasses">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 成绩编辑弹窗 -->
    <view v-if="showScoreEditModal" class="score-edit-modal" @click="closeScoreEditModal">
      <view class="score-edit-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑成绩</text>
          <view class="close-btn" @click="closeScoreEditModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="form-item">
            <text class="label">科目</text>
            <picker 
              :value="editScoreData.subjectIndex" 
              :range="allSubjects" 
              @change="onEditSubjectChange"
              class="picker"
            >
              <view class="picker-text">{{ allSubjects[editScoreData.subjectIndex] || '请选择科目' }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="label">考试类型</text>
            <picker 
              :value="editScoreData.examTypeIndex" 
              :range="examTypeOptions" 
              @change="onEditExamTypeChange"
              class="picker"
            >
              <view class="picker-text">{{ examTypeOptions[editScoreData.examTypeIndex] || '请选择考试类型' }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="label">考试成绩</text>
            <input 
              v-model="editScoreData.score" 
              class="input" 
              type="number" 
              placeholder="请输入成绩"
            />
          </view>
          
          <view class="form-item">
            <text class="label">考试日期</text>
            <input 
              v-model="editScoreData.examDate" 
              class="input" 
              type="date" 
              placeholder="请选择考试日期"
            />
          </view>
          
          <view class="form-item">
            <text class="label">备注</text>
            <textarea 
              v-model="editScoreData.remark" 
              class="textarea" 
              placeholder="备注信息（可选）"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeScoreEditModal">取消</button>
          <button class="confirm-btn" @click="saveScore">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      studentData: null,
      originalStudentData: null,
      gradeIndex: 0,
      gradeOptions: [
        '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
        '七年级', '八年级', '九年级',
        '高一', '高二', '高三'
      ],
      allSubjects: [
        '语文', '数学', '英语', '物理', '化学'
      ],
      showSubjectModalFlag: false,
      tempSubjects: [],
      availableClasses: [],
      showClassModalFlag: false,
      classSearchKeyword: '',
      filteredClasses: [],
      tempClasses: [],
      // 添加学术信息相关数据
      activeTab: 'courses',
      courses: [],
      scores: [],
      // 成绩编辑相关数据
      showScoreEditModal: false,
      editScoreData: {
        id: '',
        subject: '',
        subjectIndex: -1,
        examType: '',
        examTypeIndex: -1,
        score: '',
        examDate: '',
        remark: ''
      },
      editScoreIndex: -1,
      examTypeOptions: ['期中', '期末', '月考', '中考']
    }
  },
  onLoad(options) {
    if (options.studentId) {
      this.loadStudentDetail(options.studentId);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadStudentDetail(studentId) {
      try {
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudentDetail',
            studentId: studentId
          }
        });
        
        if (result.result.code === 0) {
          this.studentData = result.result.data;
          this.originalStudentData = JSON.parse(JSON.stringify(result.result.data));
          this.gradeIndex = this.gradeOptions.indexOf(this.studentData.grade);
          this.tempSubjects = [...this.studentData.subjects];
          this.tempClasses = [...this.studentData.classes];
          
          // 加载班级列表
          this.loadAvailableClasses();
          
          // 加载学术信息
          this.loadAcademicRecords(studentId);
        } else {
          uni.showToast({
            title: '加载学生信息失败',
            icon: 'error'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('加载学生详情失败:', error);
        uni.showToast({
          title: '加载学生信息失败',
          icon: 'error'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    async loadAvailableClasses() {
      try {
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses'
          }
        });
        
        if (result.result.code === 0) {
          this.availableClasses = result.result.data || [];
          this.filteredClasses = this.availableClasses;
        }
      } catch (error) {
        console.error('加载班级列表失败:', error);
        uni.showToast({
          title: '加载班级失败',
          icon: 'error'
        });
      }
    },
    // 添加加载学术记录的方法
    async loadAcademicRecords(studentId) {
      try {
        // 获取学生学术档案
        const academicResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudentAcademicRecords',
            studentId: studentId
          }
        });
        
        if (academicResult.result.code === 0) {
          this.courses = academicResult.result.data.courses || [];
          this.scores = academicResult.result.data.scores || [];
          
          // 如果课程数据为空，根据班级数据生成课程
          if (this.courses.length === 0 && this.studentData.classes.length > 0) {
            this.syncCoursesWithClasses();
          }
        }
      } catch (error) {
        console.error('加载学生学术档案失败:', error);
        uni.showToast({
          title: '加载学术档案失败',
          icon: 'error'
        });
      }
    },
    onGradeChange(e) {
      this.gradeIndex = e.detail.value;
      this.studentData.grade = this.gradeOptions[e.detail.value];
    },
    showSubjectModal() {
      this.tempSubjects = [...this.studentData.subjects];
      this.showSubjectModalFlag = true;
    },
    closeSubjectModal() {
      this.showSubjectModalFlag = false;
    },
    toggleSubject(subject) {
      const index = this.tempSubjects.indexOf(subject);
      if (index > -1) {
        this.tempSubjects.splice(index, 1);
      } else {
        this.tempSubjects.push(subject);
      }
    },
    removeSubject(index) {
      this.studentData.subjects.splice(index, 1);
    },
    confirmSubjects() {
      this.studentData.subjects = [...this.tempSubjects];
      this.showSubjectModalFlag = false;
    },
    // 保存学生信息
    async saveStudentInfo() {
      if (!this.studentData.name || !this.studentData.grade) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
      
      try {
        uni.showLoading({
          title: '保存中...'
        });
        
        const result = await uniCloud.callFunction({
          name: 'student-manager',
          data: {
            action: 'updateStudent',
            studentId: this.studentData.studentId,
            updateData: {
              name: this.studentData.name,
              grade: this.studentData.grade,
              subjects: this.studentData.subjects,
              classes: this.studentData.classes,
              updateTime: new Date().toISOString()
            }
          }
        });
        
        uni.hideLoading();
        
        if (result.result.code === 0) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          // 重新加载学生数据
          this.loadStudentDetail();
          
          // 更新档案管理页面的本地缓存
          this.updateArchiveCache();
        } else {
          uni.showToast({
            title: result.result.message || '保存失败',
            icon: 'error'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('保存学生信息失败:', error);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'error'
        });
      }
    },
    showClassModal() {
      this.tempClasses = [...this.studentData.classes];
      this.showClassModalFlag = true;
      this.filteredClasses = this.availableClasses;
      this.classSearchKeyword = '';
    },
    closeClassModal() {
      this.showClassModalFlag = false;
    },
    isClassSelected(classItem) {
      return this.tempClasses.some(c => c._id === classItem._id);
    },
    toggleClass(classItem) {
      const index = this.tempClasses.findIndex(c => c._id === classItem._id);
      if (index > -1) {
        this.tempClasses.splice(index, 1);
      } else {
        this.tempClasses.push(classItem);
      }
    },
    async removeClass(index) {
      const removedClass = this.studentData.classes[index];
      
      try {
        // 调用云函数从数据库中删除学生班级关联
        const result = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'removeStudentFromClass',
            classId: removedClass._id,
            studentId: this.studentData.studentId  // 使用学号字段
          }
        });
        
        if (result.result.code === 0) {
          // 删除成功，更新本地数据
          this.studentData.classes.splice(index, 1);
          
          // 同步删除对应的学习课程
          this.removeCourseByClass(removedClass);
          
          uni.showToast({
            title: '删除班级成功',
            icon: 'success'
          });
        } else {
          throw new Error(result.result.message || '删除班级失败');
        }
      } catch (error) {
        console.error('删除班级失败:', error);
        uni.showToast({
          title: '删除班级失败，请重试',
          icon: 'error'
        });
      }
    },
    async confirmClasses() {
      try {
        // 找出新增的班级和删除的班级
        const originalClassIds = this.studentData.classes.map(c => c._id);
        const newClassIds = this.tempClasses.map(c => c._id);
        
        const addedClasses = this.tempClasses.filter(c => !originalClassIds.includes(c._id));
        const removedClasses = this.studentData.classes.filter(c => !newClassIds.includes(c._id));
        
        // 添加新班级
        for (const classItem of addedClasses) {
          const result = await uniCloud.callFunction({
            name: 'class-management',
            data: {
              action: 'addStudentsToClass',
              classId: classItem._id,
              studentIds: [this.studentData.studentId]  // 这里使用studentId，因为addStudentsToClass期望的是学号
            }
          });
          
          if (result.result.code !== 0) {
            throw new Error(result.result.message || '添加班级失败');
          }
        }
        
        // 删除班级
        for (const classItem of removedClasses) {
          const result = await uniCloud.callFunction({
            name: 'class-management',
            data: {
              action: 'removeStudentFromClass',
              classId: classItem._id,
              studentId: this.studentData.studentId  // 使用学号字段
            }
          });
          
          if (result.result.code !== 0) {
            throw new Error(result.result.message || '删除班级失败');
          }
        }
        
        // 更新本地数据
        this.studentData.classes = [...this.tempClasses];
        this.showClassModalFlag = false;
        
        // 同步更新学习课程数据
        this.syncCoursesWithClasses();
        
        uni.showToast({
          title: '班级更新成功',
          icon: 'success'
        });
        
      } catch (error) {
        console.error('更新班级失败:', error);
        uni.showToast({
          title: '更新班级失败，请重试',
          icon: 'error'
        });
      }
    },
    onClassSearchInput() {
      if (!this.classSearchKeyword) {
        this.filteredClasses = this.availableClasses;
        return;
      }
      
      const keyword = this.classSearchKeyword.toLowerCase();
      this.filteredClasses = this.availableClasses.filter(classItem => {
        return (
          (classItem.className && classItem.className.toLowerCase().includes(keyword)) ||
          (classItem.grade && classItem.grade.toLowerCase().includes(keyword))
        );
      });
    },
    createNewClass() {
      // 这里可以跳转到班级创建页面或者显示创建弹窗
      uni.showToast({
        title: '请到班级管理页面创建新班级',
        icon: 'none'
      });
    },
    // 同步学习课程与班级数据
    syncCoursesWithClasses() {
      // 根据当前班级数据重新生成学习课程
      this.courses = this.studentData.classes.map(classItem => {
        // 从班级名称中提取科目信息
        const subject = this.extractSubjectFromClassName(classItem.className);
        
        return {
          courseName: subject,
          year: new Date().getFullYear(),
          semester: '秋季',
          status: '在学',
          enroll_date: new Date().toISOString(),
          completion_date: null,
          className: classItem.className
        };
      });
    },
    // 从班级名称中提取科目
    extractSubjectFromClassName(className) {
      // 根据班级名称提取科目，例如："25秋三年级数学龙班" -> "数学"
      const subjects = ['语文', '数学', '英语', '物理', '化学'];
      for (const subject of subjects) {
        if (className.includes(subject)) {
          return subject;
        }
      }
      return '未知科目';
    },
    // 根据班级删除对应的学习课程
    removeCourseByClass(removedClass) {
      const subject = this.extractSubjectFromClassName(removedClass.className);
      this.courses = this.courses.filter(course => 
        !(course.courseName === subject && course.className === removedClass.className)
      );
    },
    // 添加切换标签页的方法
    switchTab(tab) {
      this.activeTab = tab;
    },
    // 添加格式化日期的方法
    formatDate(date) {
      if (!date) return '';
      // 处理不同的日期格式
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      } else if (date instanceof Date) {
        return date.toLocaleDateString();
      } else {
        return new Date(date).toLocaleDateString();
      }
    },
    // 根据课程ID获取科目名称
    getSubjectByCourseId(courseId) {
      // 如果courseId就是科目名称，直接返回
      if (this.allSubjects.includes(courseId)) {
        return courseId;
      }
      
      // 如果有学生科目信息，尝试匹配
      if (this.studentData && this.studentData.subjects) {
        // 简单匹配，实际项目中可能需要更复杂的逻辑
        return this.studentData.subjects.find(subject => subject === courseId) || '未知科目';
      }
      
      return '未知科目';
    },
    // 编辑成绩
    editScore(score, index) {
      console.log('编辑成绩 - 原始数据:', score);
      this.editScoreIndex = index;
      
      // 尝试多种可能的ID字段
      const scoreId = score._id || score.id || score.examScoreId;
      console.log('成绩ID:', scoreId);
      
      this.editScoreData = {
        id: scoreId,
        subject: this.getSubjectByCourseId(score.course_id),
        subjectIndex: this.allSubjects.indexOf(this.getSubjectByCourseId(score.course_id)),
        examType: score.exam_name || score.examType,
        examTypeIndex: this.examTypeOptions.indexOf(score.exam_name || score.examType),
        score: score.score.toString(),
        examDate: this.formatDateForInput(score.exam_date),
        remark: score.remark || '',
        inputUser: score.inputUser || '系统用户'
      };
      console.log('编辑成绩 - 处理后的数据:', this.editScoreData);
      this.showScoreEditModal = true;
    },
    // 关闭成绩编辑弹窗
    closeScoreEditModal() {
      this.showScoreEditModal = false;
      this.editScoreIndex = -1;
      this.editScoreData = {
        id: '',
        subject: '',
        subjectIndex: -1,
        examType: '',
        examTypeIndex: -1,
        score: '',
        examDate: '',
        remark: ''
      };
    },
    // 编辑科目变化
    onEditSubjectChange(e) {
      this.editScoreData.subjectIndex = e.detail.value;
      this.editScoreData.subject = this.allSubjects[e.detail.value];
    },
    // 编辑考试类型变化
    onEditExamTypeChange(e) {
      this.editScoreData.examTypeIndex = e.detail.value;
      this.editScoreData.examType = this.examTypeOptions[e.detail.value];
    },
    // 保存成绩修改
    async saveScore() {
      if (!this.editScoreData.subject || !this.editScoreData.examType || !this.editScoreData.score || !this.editScoreData.examDate) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
      
      try {
        const updateData = {
          subject: this.editScoreData.subject,
          examType: this.editScoreData.examType,
          exam_name: this.editScoreData.examType, // 兼容exam_name字段
          score: Number(this.editScoreData.score),
          examDate: this.editScoreData.examDate,
          exam_date: this.editScoreData.examDate, // 兼容exam_date字段
          remark: this.editScoreData.remark,
          inputUser: this.editScoreData.inputUser || '系统用户',
          // 强制添加时间戳确保有变化
          lastModified: Date.now(),
          editTimestamp: new Date().toISOString()
        };
        
        // 确保数据类型正确
        if (updateData.score && typeof updateData.score === 'string') {
          updateData.score = Number(updateData.score);
        }
        
        console.log('保存成绩 - 发送数据:', {
          action: 'updateScore',
          id: this.editScoreData.id,
          data: updateData
        });
        
        const result = await uniCloud.callFunction({
          name: 'exam-scores',
          data: {
            action: 'updateScore',
            id: this.editScoreData.id,
            data: updateData
          }
        });
        
        console.log('保存成绩 - 云函数返回:', result);
        
        if (result.result.code === 200) {
          // 更新本地数据
          this.scores[this.editScoreIndex] = {
            ...this.scores[this.editScoreIndex],
            courseName: this.editScoreData.subject,
            exam_name: this.editScoreData.examType,
            score: Number(this.editScoreData.score),
            exam_date: this.editScoreData.examDate,
            remark: this.editScoreData.remark
          };
          
          uni.showToast({
            title: '修改成功',
            icon: 'success'
          });
          
          this.closeScoreEditModal();
        } else {
          console.error('云函数返回错误:', result.result);
          throw new Error(result.result.message || '修改失败');
        }
      } catch (error) {
        console.error('修改成绩失败:', error);
        uni.showToast({
          title: '修改失败，请重试',
          icon: 'error'
        });
      }
    },
    // 删除成绩
    deleteScore() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条成绩记录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              console.log('删除成绩 - ID:', this.editScoreData.id);
              
              const result = await uniCloud.callFunction({
                name: 'exam-scores',
                data: {
                  action: 'deleteScore',
                  id: this.editScoreData.id
                }
              });
              
              console.log('删除成绩 - 云函数返回:', result);
              
              if (result.result.code === 200) {
                // 从本地数据中删除
                this.scores.splice(this.editScoreIndex, 1);
                
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                
                this.closeScoreEditModal();
              } else {
                throw new Error(result.result.message || '删除失败');
              }
            } catch (error) {
              console.error('删除成绩失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'error'
              });
            }
          }
        }
      });
    },
    // 格式化日期为输入框格式
    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    deleteStudent() {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除学生 ${this.studentData.name} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await uniCloud.callFunction({
                name: 'archive-manager',
                data: {
                  action: 'deleteStudent',
                  studentId: this.studentData.studentId
                }
              });
              
              if (result.result.code === 0) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                
                // 返回档案管理页面并刷新
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              } else {
                throw new Error(result.result.message || '删除失败');
              }
            } catch (error) {
              console.error('删除学生失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'error'
              });
            }
          }
        }
      });
    },
    
    // 更新档案管理页面的本地缓存
    updateArchiveCache() {
      try {
        const app = getApp();
        if (app.globalData && app.globalData.updateArchiveCache) {
          app.globalData.updateArchiveCache();
          console.log('已通知档案管理页面更新缓存');
        } else {
          console.log('档案管理页面未加载，无法更新缓存');
        }
      } catch (error) {
        console.error('更新档案管理缓存失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
  padding-top: 120rpx; /* 为自定义导航栏留出空间 */
}

/* 自定义导航栏样式 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1rpx solid #e5e5e5;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-left:active {
  transform: translateX(-5rpx);
}

.back-icon {
  font-size: 40rpx;
  color: #1976D2;
  margin-right: 8rpx;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-right {
  width: 100rpx;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.form-container:hover {
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  transform: translateY(-2rpx);
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

.picker,
.date-picker {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.picker:active,
.date-picker:active {
  background: rgba(230, 240, 255, 0.9);
}

.arrow {
  color: #1976D2;
  font-size: 28rpx;
  font-weight: bold;
}

.subject-selector,
.class-selector {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 10rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.subject-selector:active,
.class-selector:active {
  background: rgba(230, 240, 255, 0.9);
}

.subject-display,
.class-display {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 60rpx;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
  font-style: italic;
}

.selected-subjects,
.selected-classes {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.subject-tag,
.class-tag {
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  border-radius: 20rpx;
  padding: 6rpx 12rpx;
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.3);
  transition: all 0.3s ease;
}

.subject-tag:active,
.class-tag:active {
  transform: scale(0.95);
}

.subject-text,
.class-text {
  color: #fff;
  margin-right: 6rpx;
  font-weight: 500;
}

.remove-btn {
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
  cursor: pointer;
  padding: 2rpx;
  border-radius: 50%;
  width: 20rpx;
  height: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.remove-btn:active {
  background: rgba(255, 255, 255, 0.4);
}

.score-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(248, 250, 255, 0.7);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.05);
}

.score-section {
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  border: 1rpx solid rgba(79, 195, 247, 0.2);
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.1);
}

.score-section:hover {
  box-shadow: 0 6rpx 20rpx rgba(79, 195, 247, 0.15);
}

.score-instructions {
  font-size: 26rpx;
  color: #1976D2;
  margin-bottom: 20rpx;
  text-align: center;
  font-weight: 500;
}

.score-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.score-item:hover {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transform: translateY(-2rpx);
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.subject-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #1976D2;
}

.remove-score {
  font-size: 36rpx;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5rpx;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-score:active {
  background: rgba(255, 107, 107, 0.1);
  transform: scale(0.9);
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.form-item-inline {
  display: flex;
  align-items: center;
}

.inline-label {
  width: 120rpx;
  font-size: 26rpx;
  color: #1976D2;
  margin-right: 10rpx;
  font-weight: 500;
}

.inline-input {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 8rpx;
  padding: 0 15rpx;
  font-size: 26rpx;
  color: #333;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.inline-input:focus {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

.score-input {
  text-align: center;
  font-weight: bold;
  color: #4FC3F7;
}

.add-score-btn {
  text-align: center;
  padding: 20rpx;
  border: 2rpx dashed #4FC3F7;
  border-radius: 12rpx;
  margin-top: 10rpx;
  cursor: pointer;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  transition: all 0.3s ease;
}

.add-score-btn:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 10rpx rgba(79, 195, 247, 0.2);
}

.add-score-text {
  color: #4FC3F7;
  font-size: 28rpx;
  font-weight: 500;
}

.preview-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.preview-section:hover {
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
  transform: translateY(-2rpx);
}

.preview-title {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.student-preview {
  display: flex;
  justify-content: center;
}

.student-card {
  width: 100%;
  max-width: 400rpx;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(79, 195, 247, 0.3);
}

.student-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.student-name {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.student-id,
.student-grade,
.student-subjects,
.student-school,
.student-classes {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5rpx;
  text-align: center;
}

.preview-placeholder {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}

/* 删除按钮容器 - 右下角固定定位 */
.delete-button-container {
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  z-index: 999;
}

.delete-button-image {
  width: 80rpx;
  height: 80rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.2));
}

.delete-button-image:active {
  transform: scale(0.9);
  filter: drop-shadow(0 2rpx 8rpx rgba(0, 0, 0, 0.3));
}

/* 学术信息区域 */
.academic-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 28rpx;
  color: #1976D2;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
}

.tab:active {
  background: rgba(230, 240, 255, 0.9);
}

.tab.active {
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(25, 118, 210, 0.2);
}

/* 课程列表 */
.course-list,
.score-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.course-item,
.score-item {
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.course-item:hover,
.score-item:hover {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transform: translateY(-2rpx);
}

.score-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.score-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.course-header,
.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.course-name,
.exam-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #1976D2;
}

.course-year {
  font-size: 24rpx;
  color: #4FC3F7;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.course-details,
.score-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.status,
.enroll-date,
.completion-date,
.score-value,
.exam-date,
.remark,
.class-info,
.subject-info {
  font-size: 24rpx;
  color: #666;
}

.score-value {
  font-weight: bold;
  color: #4FC3F7;
}

.class-info {
  color: #9C27B0;
  font-weight: 500;
}

.subject-info {
  color: #1976D2;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 科目选择弹窗 */
.subject-modal,
.class-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5rpx);
}

.subject-modal-content,
.class-modal-content {
  width: 90%;
  max-width: 600rpx;
  max-height: 80%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
}

.close-btn {
  padding: 10rpx;
  cursor: pointer;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(240, 240, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:active {
  background: rgba(200, 200, 200, 0.8);
  transform: rotate(90deg);
}

.close-icon {
  font-size: 36rpx;
  color: #999;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx 30rpx;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.subject-item {
  height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.subject-item:active {
  transform: translateY(-2rpx);
}

.subject-item.selected {
  border-color: #4FC3F7;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.2);
}

.subject-name {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
}

.check-icon {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  border-radius: 50%;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 6rpx rgba(79, 195, 247, 0.3);
}

.modal-footer {
  display: flex;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  gap: 20rpx;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 70rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
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
  color: #fff;
  border: none;
  box-shadow: 0 4rpx 15rpx rgba(25, 118, 210, 0.3);
}

.confirm-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(25, 118, 210, 0.4);
}

/* 保存按钮样式 */
.save-button-container {
  padding: 30rpx 40rpx;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
}

.save-button {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 15rpx rgba(79, 195, 247, 0.3);
  transition: all 0.3s ease;
}

.save-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.3);
}

/* 班级选择弹窗特定样式 */
.search-container {
  margin-bottom: 20rpx;
}

.search-input {
  width: 100%;
  height: 70rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

.search-tip {
  text-align: center;
  margin-bottom: 20rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
}

.class-grid {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.class-item {
  padding: 20rpx;
  border: 2rpx solid rgba(156, 39, 176, 0.2);
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.class-item:active {
  transform: translateY(-2rpx);
}

.class-item.selected {
  border-color: #9C27B0;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  box-shadow: 0 4rpx 12rpx rgba(156, 39, 176, 0.2);
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.class-name {
  font-size: 28rpx;
  color: #9C27B0;
  font-weight: bold;
}

.class-grade,
.class-teacher {
  font-size: 24rpx;
  color: #666;
}

.create-class-item {
  padding: 20rpx;
  border: 2rpx dashed #9C27B0;
  border-radius: 12rpx;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(135deg, #f8f0fa 0%, #f3e5f5 100%);
  transition: all 0.3s ease;
}

.create-class-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 10rpx rgba(156, 39, 176, 0.2);
}

.create-text {
  font-size: 28rpx;
  color: #9C27B0;
  font-weight: 500;
}

.empty-class-tip {
  text-align: center;
  padding: 40rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}


/* 成绩编辑弹窗样式 */
.score-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5rpx);
}

.score-edit-modal-content {
  width: 90%;
  max-width: 600rpx;
  max-height: 80%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  animation: modalAppear 0.3s ease-out;
}

.picker-text {
  color: #333;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  min-height: 120rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  resize: none;
}

.textarea:focus {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

</style>