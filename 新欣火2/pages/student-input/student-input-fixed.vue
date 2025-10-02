<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">学生录入</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <view class="form-container animated-card">
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">基本信息</text>
        </view>
        
        <view class="form-item">
          <text class="label">学生姓名 *</text>
          <view class="input-wrapper">
            <input 
              class="input" 
              v-model="formData.name" 
              placeholder="请输入学生姓名"
              maxlength="20"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">年级 *</text>
          <view class="picker-wrapper">
            <picker 
              mode="selector" 
              :value="gradeIndex" 
              :range="gradeOptions" 
              @change="onGradeChange"
            >
              <view class="picker">
                {{ formData.grade || '请选择年级' }}
                <text class="arrow">></text>
              </view>
            </picker>
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">所学科目 *</text>
          <view class="subject-selector" @click="showSubjectModal">
            <view class="subject-display">
              <text v-if="formData.subjects.length === 0" class="placeholder">请选择科目</text>
              <view v-else class="selected-subjects">
                <view 
                  v-for="(subject, index) in formData.subjects" 
                  :key="index"
                  class="subject-tag animated-tag"
                >
                  <text class="subject-text">{{ subject }}</text>
                  <text class="remove-btn" @click.stop="removeSubject(index)">×</text>
                </view>
              </view>
            </view>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">学校信息</text>
        </view>
        
        <view class="form-item">
          <text class="label">学校</text>
          <view class="input-wrapper">
            <input 
              class="input" 
              v-model="formData.school" 
              placeholder="请输入学校名称（可选）"
              maxlength="50"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">加入班级</text>
          <view class="class-selector" @click="showClassModal">
            <view class="class-display">
              <text v-if="formData.classes.length === 0" class="placeholder">请选择班级（可选）</text>
              <view v-else class="selected-classes">
                <view 
                  v-for="(classItem, index) in formData.classes" 
                  :key="index"
                  class="class-tag animated-tag"
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
      
      <!-- 成绩录入开关 -->
      <view class="form-item toggle-item">
        <view class="score-toggle">
          <text class="label">录入成绩</text>
          <switch :checked="enableScoreInput" @change="toggleScoreInput" color="#1976D2" />
        </view>
      </view>
      
      <!-- 成绩录入区域 -->
      <view v-if="enableScoreInput" class="score-section animated-section">
        <view class="section-header">
          <text class="section-title">成绩信息</text>
          <text class="section-desc">请为学生录入各科成绩（可选）</text>
        </view>
        
        <view 
          v-for="(score, index) in formData.scores" 
          :key="index"
          class="score-item animated-card"
        >
          <view class="score-header">
            <text class="subject-label">成绩 {{ index + 1 }}</text>
            <text class="remove-score" @click="removeScore(index)">×</text>
          </view>
          
          <view class="score-details">
            <view class="form-item-inline">
              <text class="inline-label">科目 *</text>
              <view class="picker-wrapper">
                <picker 
                  mode="selector" 
                  :value="getSubjectIndex(score.subject)" 
                  :range="formData.subjects" 
                  @change="onSubjectChange(index, $event)"
                  :disabled="formData.subjects.length === 0"
                >
                  <view class="picker">
                    {{ score.subject || '请选择科目' }}
                    <text class="arrow">></text>
                  </view>
                </picker>
              </view>
            </view>
            
            <view class="form-item-inline">
              <text class="inline-label">考试名称</text>
              <view class="input-wrapper">
                <input 
                  class="inline-input" 
                  v-model="score.examName" 
                  placeholder="如：期中考试"
                  maxlength="20"
                />
              </view>
            </view>
            
            <view class="form-item-inline">
              <text class="inline-label">成绩</text>
              <view class="input-wrapper">
                <input 
                  class="inline-input score-input" 
                  v-model="score.score" 
                  type="digit"
                  placeholder="0-100"
                  maxlength="3"
                />
              </view>
            </view>
            
            <view class="form-item-inline">
              <text class="inline-label">考试日期</text>
              <view class="picker-wrapper">
                <picker 
                  mode="date" 
                  :value="score.examDate" 
                  @change="onExamDateChange(index, $event)"
                >
                  <view class="date-picker">
                    {{ score.examDate || '请选择日期' }}
                    <text class="arrow">></text>
                  </view>
                </picker>
              </view>
            </view>
            
            <view class="form-item-inline">
              <text class="inline-label">备注</text>
              <view class="input-wrapper">
                <input 
                  class="inline-input" 
                  v-model="score.remark" 
                  placeholder="可选备注信息"
                  maxlength="50"
                />
              </view>
            </view>
          </view>
        </view>
        
        <view class="add-score-btn" @click="addScore">
          <text class="add-score-text">+ 添加成绩</text>
        </view>
      </view>
    </view>
    
    <view class="preview-section animated-card">
      <text class="preview-title">学号预览</text>
      <view class="student-preview" v-if="formData.name && formData.grade">
        <view class="student-card">
          <view class="student-avatar">
            <text class="avatar-text">{{ formData.name.charAt(0) }}</text>
          </view>
          <view class="student-info">
            <text class="student-name">{{ formData.name }}</text>
            <text class="student-id">学号：{{ generatedStudentId }}</text>
            <text class="student-grade">年级：{{ formData.grade }}</text>
            <text class="student-subjects">科目：{{ formData.subjects.join('、') || '未选择' }}</text>
            <text class="student-school" v-if="formData.school">学校：{{ formData.school }}</text>
            <text class="student-classes" v-if="formData.classes.length > 0">班级：{{ formData.classes.map(c => c.className).join('、') }}</text>
          </view>
        </view>
      </view>
      <view v-else class="preview-placeholder">
        <text>请填写学生姓名和年级以预览学号</text>
      </view>
    </view>
    
    <view class="button-container">
      <button 
        class="submit-btn" 
        @click="submitStudent" 
        :disabled="!canSubmit || isLoading"
        :class="{ loading: isLoading }"
      >
        <text v-if="!isLoading">{{ isBatchMode ? '添加到批量列表' : '录入学生' }}</text>
        <text v-else>录入中...</text>
      </button>
      
      <button 
        v-if="isBatchMode && batchStudents.length > 0" 
        class="batch-submit-btn" 
        @click="submitBatch"
        :disabled="isLoading"
      >
        批量录入 ({{ batchStudents.length }}人)
      </button>
    </view>
    
    <!-- 批量录入列表 -->
    <view v-if="isBatchMode && batchStudents.length > 0" class="batch-list animated-card">
      <view class="section-header">
        <text class="section-title">批量录入列表</text>
        <text class="clear-batch" @click="clearBatch">清空</text>
      </view>
      
      <view class="batch-items">
        <view 
          v-for="(student, index) in batchStudents" 
          :key="index"
          class="batch-item"
        >
          <view class="batch-item-info">
            <text class="batch-student-name">{{ student.name }}</text>
            <text class="batch-student-id">{{ student.studentId }}</text>
          </view>
          <view class="batch-item-actions">
            <text class="edit-btn" @click="editBatchStudent(index)">编辑</text>
            <text class="remove-btn" @click="removeBatchStudent(index)">删除</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 科目选择弹窗 -->
    <view v-if="showSubjectModalFlag" class="subject-modal" @click="closeSubjectModal">
      <view class="subject-modal-content animated-modal" @click.stop>
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
              <view class="check-indicator" v-if="tempSubjects.includes(subject)">
                <text class="check-icon">✓</text>
              </view>
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
      <view class="class-modal-content animated-modal" @click.stop>
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
                <view class="class-header">
                  <text class="class-name">{{ classItem.className }}</text>
                  <text class="class-grade-badge">{{ classItem.grade }}</text>
                </view>
                <text class="class-teacher">班主任：{{ classItem.teacherName }}</text>
                <text class="class-student-count">{{ classItem.studentCount || 0 }}名学生</text>
              </view>
              <view class="selection-indicator" v-if="isClassSelected(classItem)">
                <text class="check-icon">✓</text>
              </view>
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
    
    <!-- 创建班级弹窗 -->
    <view v-if="showCreateClassModal" class="create-class-modal" @click="closeCreateClassModal">
      <view class="create-class-modal-content animated-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">创建新班级</text>
          <view class="close-btn" @click="closeCreateClassModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="form-group">
            <label class="form-label">班级名称</label>
            <view class="input-wrapper">
              <input 
                class="form-input" 
                v-model="newClassName" 
                placeholder="请输入班级名称" 
              />
            </view>
          </view>
          
          <view class="form-group">
            <label class="form-label">年级</label>
            <view class="picker-wrapper">
              <picker 
                mode="selector" 
                :value="newClassGradeIndex" 
                :range="gradeOptions" 
                @change="onNewClassGradeChange"
              >
                <view class="picker">
                  {{ newClassGrade || '请选择年级' }}
                  <text class="arrow">></text>
                </view>
              </picker>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeCreateClassModal">取消</button>
          <button class="confirm-btn" @click="confirmCreateClass">创建</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        grade: '',
        subjects: [],
        school: '',
        classes: [],
        scores: [] // 添加成绩数据
      },
      gradeIndex: 0,
      gradeOptions: [
        '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
        '七年级', '八年级', '九年级',
        '高一', '高二', '高三'
      ],
      allSubjects: [
        '语文', '数学', '英语', '物理', '化学'
      ],
      tempSubjects: [], // 添加临时科目选择变量
      showSubjectModalFlag: false,
      availableClasses: [],
      showClassModalFlag: false,
      isBatchMode: false,
      batchStudents: [],
      isLoading: false,
      classSearchKeyword: '',
      filteredClasses: [],
      showCreateClassModal: false, // 添加创建班级弹窗显示状态
      newClassName: '', // 添加新班级名称
      newClassGrade: '', // 添加新班级年级
      newClassGradeIndex: 0, // 添加新班级年级索引
      enableScoreInput: false // 添加成绩录入开关状态
    }
  },
  computed: {
    generatedStudentId() {
      if (!this.formData.name || !this.formData.grade) return '';
      
      // 生成学号规则：年级代码 + 姓名拼音首字母 + 随机数字
      const gradeCode = this.getGradeCode(this.formData.grade);
      const nameCode = this.getNameCode(this.formData.name);
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `${gradeCode}${nameCode}${randomNum}`;
    },
    canSubmit() {
      return this.formData.name.trim() && 
             this.formData.grade && 
             this.formData.subjects.length > 0 &&
             !this.isLoading;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onGradeChange(e) {
      this.gradeIndex = e.detail.value;
      this.formData.grade = this.gradeOptions[e.detail.value];
    },
    showSubjectModal() {
      // 初始化临时科目选择数组
      this.tempSubjects = [...this.formData.subjects];
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
      this.formData.subjects.splice(index, 1);
    },
    confirmSubjects() {
      // 将临时选择的科目保存到表单数据中
      this.formData.subjects = [...this.tempSubjects];
      this.showSubjectModalFlag = false;
      // 如果启用了成绩录入且已有成绩项，需要更新成绩项中的科目选项
      if (this.enableScoreInput && this.formData.scores.length > 0) {
        this.formData.scores.forEach((score, index) => {
          // 如果当前选择的科目不在新的科目列表中，更新为第一个科目
          if (!this.formData.subjects.includes(score.subject)) {
            this.$set(this.formData.scores[index], 'subject', 
                      this.formData.subjects.length > 0 ? this.formData.subjects[0] : '');
          }
        });
      }
    },
    // 班级选择相关方法
    showClassModal() {
      this.loadAvailableClasses();
      this.showClassModalFlag = true;
      // 初始化过滤后的班级列表
      this.filteredClasses = this.availableClasses;
      this.classSearchKeyword = '';
    },
    closeClassModal() {
      this.showClassModalFlag = false;
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
          // 更新过滤后的班级列表
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
    isClassSelected(classItem) {
      return this.formData.classes.some(c => c._id === classItem._id);
    },
    toggleClass(classItem) {
      const index = this.formData.classes.findIndex(c => c._id === classItem._id);
      if (index > -1) {
        this.formData.classes.splice(index, 1);
      } else {
        this.formData.classes.push(classItem);
      }
    },
    removeClass(index) {
      this.formData.classes.splice(index, 1);
    },
    confirmClasses() {
      this.showClassModalFlag = false;
    },
    getGradeCode(grade) {
      const gradeMap = {
        '一年级': '01', '二年级': '02', '三年级': '03', '四年级': '04', '五年级': '05', '六年级': '06',
        '七年级': '07', '八年级': '08', '九年级': '09',
        '高一': '10', '高二': '11', '高三': '12'
      };
      return gradeMap[grade] || '00';
    },
    getNameCode(name) {
      // 简单的拼音首字母生成（实际项目中建议使用专业的拼音库）
      const pinyinMap = {
        'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H',
        'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P',
        'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X',
        'y': 'Y', 'z': 'Z'
      };
      
      // 取姓名的前两个字符的拼音首字母
      let code = '';
      for (let i = 0; i < Math.min(name.length, 2); i++) {
        const char = name[i].toLowerCase();
        if (pinyinMap[char]) {
          code += pinyinMap[char];
        } else {
          // 如果不是英文字母，使用字符的ASCII码
          code += String.fromCharCode(65 + (char.charCodeAt(0) % 26));
        }
      }
      
      return code.padEnd(2, 'X');
    },
    toggleBatchMode() {
      this.isBatchMode = !this.isBatchMode;
      if (!this.isBatchMode) {
        // 退出批量模式时清空表单
        this.resetForm();
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        grade: '',
        subjects: [],
        school: '',
        classes: [],
        scores: [] // 重置成绩数据
      };
      this.gradeIndex = 0;
      this.enableScoreInput = false; // 重置成绩录入开关
    },
    // 添加成绩录入开关方法
    toggleScoreInput(e) {
      this.enableScoreInput = e.detail.value;
      // 如果启用成绩录入但还没有成绩项，则添加一个空的成绩项
      if (this.enableScoreInput && this.formData.scores.length === 0) {
        // 确保至少有一个科目可选
        if (this.formData.subjects.length === 0) {
          uni.showToast({
            title: '请先选择科目',
            icon: 'none'
          });
          // 关闭成绩录入开关
          this.enableScoreInput = false;
          return;
        }
        this.addScore();
      }
    },
    // 添加成绩项
    addScore() {
      // 确保至少有一个科目可选
      if (this.formData.subjects.length === 0) {
        uni.showToast({
          title: '请先选择科目',
          icon: 'none'
        });
        return;
      }
      
      this.formData.scores.push({
        subject: this.formData.subjects[0], // 默认选择第一个科目
        examName: '',
        score: '',
        examDate: '',
        remark: ''
      });
    },
    // 删除成绩项
    removeScore(index) {
      this.formData.scores.splice(index, 1);
    },
    // 考试日期改变
    onExamDateChange(index, e) {
      this.formData.scores[index].examDate = e.detail.value;
    },
    async submitStudent() {
      if (!this.canSubmit) return;
      
      this.isLoading = true;
      
      try {
        const studentData = {
          name: this.formData.name.trim(),
          grade: this.formData.grade,
          subjects: this.formData.subjects,
          school: this.formData.school.trim(),
          classes: this.formData.classes, // 添加班级信息
          studentId: this.generatedStudentId,
          createTime: new Date().toISOString(),
          
        };
        
        // 如果启用了成绩录入，添加成绩数据
        if (this.enableScoreInput && this.formData.scores.length > 0) {
          studentData.scores = this.formData.scores.filter(score => 
            score.subject && score.examName && score.score
          );
        }
        
        if (this.isBatchMode) {
          // 批量模式：添加到列表
          this.batchStudents.push(studentData);
          uni.showToast({
            title: '已添加到批量列表',
            icon: 'success'
          });
          this.resetForm();
        } else {
          // 单个模式：直接提交
          await this.saveStudent(studentData);
          uni.showToast({
            title: '录入成功',
            icon: 'success'
          });
          this.resetForm();
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({
          title: '录入失败，请重试',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },
    async saveStudent(studentData) {
      // 调用云函数保存学生数据
      const result = await uniCloud.callFunction({
        name: 'student-manager',
        data: {
          action: 'addStudent',
          studentData: studentData
        }
      });
      
      if (result.result.code !== 0) {
        throw new Error(result.result.message || '保存失败');
      }
      
      // 如果有成绩数据，还需要保存成绩信息
      if (studentData.scores && studentData.scores.length > 0) {
        await this.saveStudentScores(studentData.studentId, studentData.scores);
      }
      
      return result.result;
    },
    // 保存学生成绩
    async saveStudentScores(studentId, scores) {
      try {
        // 获取课程信息，用于关联成绩和课程
        const courseResult = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClasses'
          }
        });
        
        // 这里需要根据科目获取对应的课程ID，简化处理直接使用科目名作为课程ID
        // 实际项目中应该有更完善的课程管理逻辑
        const scoreData = scores.map(score => {
          // 正确处理日期格式
          let examDate = new Date();
          if (score.examDate) {
            if (typeof score.examDate === 'string') {
              // 如果是字符串格式的日期，确保格式正确
              examDate = new Date(score.examDate);
            } else if (score.examDate instanceof Date) {
              // 如果已经是Date对象
              examDate = score.examDate;
            }
          }
          
          return {
            student_id: studentId,
            course_id: score.subject, // 简化处理，实际应该查询课程表获取课程ID
            exam_name: score.examName,
            score: parseFloat(score.score),
            exam_date: examDate.toISOString(), // 转换为ISO字符串格式
            remark: score.remark,
            create_time: new Date().toISOString() // 转换为ISO字符串格式
          };
        });
        
        // 批量插入成绩数据
        for (let i = 0; i < scoreData.length; i++) {
          await uniCloud.database().collection('student_scores').add(scoreData[i]);
        }
        
        console.log('成绩保存成功');
      } catch (error) {
        console.error('保存成绩失败:', error);
        // 不抛出错误，因为成绩保存失败不应该影响学生信息的录入
        uni.showToast({
          title: '成绩保存失败，但学生信息已录入',
          icon: 'none'
        });
      }
    },
    editBatchStudent(index) {
      const student = this.batchStudents[index];
      this.formData = {
        name: student.name,
        grade: student.grade,
        subjects: [...student.subjects],
        school: student.school,
        classes: [...(student.classes || [])],
        scores: student.scores ? [...student.scores] : [] // 恢复成绩数据
      };
      this.gradeIndex = this.gradeOptions.indexOf(student.grade);
      this.isBatchMode = false;
      // 如果有成绩数据，启用成绩录入
      if (student.scores && student.scores.length > 0) {
        this.enableScoreInput = true;
      }
    },
    removeBatchStudent(index) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除学生 ${this.batchStudents[index].name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            this.batchStudents.splice(index, 1);
            uni.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },
    clearBatch() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有学生信息吗？',
        success: (res) => {
          if (res.confirm) {
            this.batchStudents = [];
            uni.showToast({
              title: '已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    async submitBatch() {
      if (this.batchStudents.length === 0) return;
      
      this.isLoading = true;
      
      try {
        const result = await uniCloud.callFunction({
          name: 'student-manager',
          data: {
            action: 'addBatchStudents',
            studentsData: this.batchStudents
          }
        });
        
        if (result.result.code === 0) {
          uni.showToast({
            title: `成功录入 ${this.batchStudents.length} 名学生`,
            icon: 'success'
          });
          this.batchStudents = [];
          this.isBatchMode = false;
        } else {
          throw new Error(result.result.message || '批量录入失败');
        }
      } catch (error) {
        console.error('批量提交失败:', error);
        uni.showToast({
          title: '批量录入失败，请重试',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 班级搜索输入处理
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
      this.newClassName = this.classSearchKeyword;
      this.showCreateClassModal = true;
    },
    
    // 确认创建新班级
    async confirmCreateClass() {
      if (!this.newClassName.trim()) {
        uni.showToast({
          title: '请输入班级名称',
          icon: 'none'
        });
        return;
      }
      
      try {
        uni.showLoading({
          title: '创建中...'
        });
        
        const result = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'addClass',
            className: this.newClassName,
            grade: this.newClassGrade || this.formData.grade || '', // 使用新选择的年级或学生年级
            teachers: [] // 默认无老师
          }
        });
        
        if (result.result.code === 0) {
          // 创建成功后重新加载班级列表
          await this.loadAvailableClasses();
          
          // 选中新创建的班级
          const newClass = this.availableClasses.find(c => c.className === this.newClassName);
          if (newClass) {
            this.toggleClass(newClass);
          }
          
          // 关闭创建班级弹窗
          this.showCreateClassModal = false;
          this.newClassName = '';
          this.newClassGrade = '';
          this.newClassGradeIndex = 0;
          
          uni.showToast({
            title: '班级创建成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: result.result.message || '创建失败',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('创建班级失败:', error);
        uni.showToast({
          title: '创建失败，请重试',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 取消创建新班级
    closeCreateClassModal() {
      this.showCreateClassModal = false;
      this.newClassName = '';
    },
    
    // 新班级年级选择
    onNewClassGradeChange(e) {
      this.newClassGradeIndex = e.detail.value;
      this.newClassGrade = this.gradeOptions[e.detail.value];
    },
    
    // 添加过滤班级的方法
    getFilteredClasses() {
      if (!this.classSearchKeyword) return this.availableClasses;
      
      const keyword = this.classSearchKeyword.toLowerCase();
      return this.availableClasses.filter(classItem => {
        return classItem.className.toLowerCase().includes(keyword) ||
               classItem.grade.toLowerCase().includes(keyword);
      });
    },
    getSubjectIndex(subject) {
      // 确保formData.subjects存在且不为空
      if (this.formData.subjects && this.formData.subjects.length > 0) {
        const index = this.formData.subjects.indexOf(subject);
        return index >= 0 ? index : 0; // 如果找不到科目，返回0
      }
      return 0;
    },
    onSubjectChange(index, e) {
      // 确保formData.subjects存在且不为空
      if (this.formData.subjects && this.formData.subjects.length > 0) {
        const selectedIndex = e.detail.value;
        if (selectedIndex >= 0 && selectedIndex < this.formData.subjects.length) {
          this.$set(this.formData.scores[index], 'subject', this.formData.subjects[selectedIndex]);
        }
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

.form-section {
  margin-bottom: 30rpx;
  background: rgba(248, 250, 255, 0.7);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.05);
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-desc {
  font-size: 24rpx;
  color: #666;
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

.input-wrapper {
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

.input-wrapper:focus-within {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

.input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 28rpx;
  color: #333;
  outline: none;
}

.picker-wrapper {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.picker-wrapper:active {
  background: rgba(230, 240, 255, 0.9);
}

.arrow {
  color: #1976D2;
  font-size: 28rpx;
  font-weight: bold;
}

/* 科目选择器样式 */
.subject-selector {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
}

.subject-selector:active {
  background: rgba(230, 240, 255, 0.9);
}

.subject-display {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
  font-style: italic;
}

.selected-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.subject-tag {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  color: #fff;
  padding: 8rpx 12rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.3);
  transition: all 0.3s ease;
}

.subject-tag:active {
  transform: scale(0.95);
}

.subject-text {
  margin-right: 8rpx;
  font-weight: 500;
}

.remove-btn {
  font-size: 20rpx;
  font-weight: bold;
  cursor: pointer;
  padding: 2rpx;
  border-radius: 50%;
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.remove-btn:active {
  background: rgba(255, 255, 255, 0.4);
}

/* 科目选择弹窗样式 */
.subject-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  backdrop-filter: blur(5rpx);
}

.subject-modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
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
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(240, 240, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:active {
  background: rgba(200, 200, 200, 0.8);
  transform: rotate(90deg);
}

.close-icon {
  font-size: 32rpx;
  color: #999;
}

.modal-body {
  padding: 30rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.subject-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.subject-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 25rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  background: rgba(248, 250, 255, 0.7);
  min-width: 200rpx;
  transition: all 0.3s ease;
  cursor: pointer;
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

.check-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  box-shadow: 0 2rpx 6rpx rgba(79, 195, 247, 0.3);
}

.check-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
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
  box-shadow: 0 4rpx 15rpx rgba(25, 118, 210, 0.3);
}

.confirm-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(25, 118, 210, 0.4);
}

/* 班级选择器样式 */
.class-selector {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid rgba(156, 39, 176, 0.2);
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
}

.class-selector:active {
  background: rgba(243, 229, 245, 0.9);
}

.class-display {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.selected-classes {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.class-tag {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: #fff;
  padding: 8rpx 12rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(156, 39, 176, 0.3);
  transition: all 0.3s ease;
}

.class-tag:active {
  transform: scale(0.95);
}

.class-text {
  margin-right: 8rpx;
  font-weight: 500;
}

/* 班级选择弹窗样式 */
.class-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  backdrop-filter: blur(5rpx);
}

.class-modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  animation: modalAppear 0.3s ease-out;
}

/* 搜索框样式 */
.search-container {
  padding: 20rpx 30rpx 10rpx 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.search-input {
  width: 100%;
  height: 70rpx;
  border: 2rpx solid rgba(156, 39, 176, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #9C27B0;
  box-shadow: 0 0 0 2rpx rgba(156, 39, 176, 0.2);
}

/* 搜索提示样式 */
.search-tip {
  padding: 10rpx 30rpx 20rpx 30rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
}

/* 空班级提示样式 */
.empty-class-tip {
  padding: 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.class-grid {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 20rpx 30rpx;
  overflow-y: auto;
  flex: 1;
}

.class-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 2rpx solid rgba(156, 39, 176, 0.2);
  border-radius: 12rpx;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
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
  flex: 1;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rpx;
}

.class-name {
  font-size: 28rpx;
  color: #9C27B0;
  font-weight: bold;
  display: block;
}

.class-grade-badge {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  background: rgba(156, 39, 176, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.class-teacher {
  font-size: 24rpx;
  color: #666;
}

.class-student-count {
  font-size: 24rpx;
  color: #666;
}

.selection-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  box-shadow: 0 2rpx 6rpx rgba(156, 39, 176, 0.3);
}

.check-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
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
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: #fff;
  box-shadow: 0 4rpx 15rpx rgba(156, 39, 176, 0.3);
}

.confirm-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(156, 39, 176, 0.4);
}

/* 创建新班级选项样式 */
.create-class-item {
  padding: 20rpx;
  border: 2rpx dashed #9C27B0;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #f8f0fa 0%, #f3e5f5 100%);
  text-align: center;
  cursor: pointer;
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

/* 创建班级弹窗样式 */
.create-class-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  backdrop-filter: blur(5rpx);
}

.create-class-modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  animation: modalAppear 0.3s ease-out;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.input-wrapper {
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

.input-wrapper:focus-within {
  border-color: #4FC3F7;
  box-shadow: 0 0 0 2rpx rgba(79, 195, 247, 0.2);
}

.form-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 28rpx;
  color: #333;
  outline: none;
}

.picker-wrapper {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.picker-wrapper:active {
  background: rgba(230, 240, 255, 0.9);
}

.arrow {
  color: #1976D2;
  font-size: 28rpx;
  font-weight: bold;
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
  font-weight: bold;
  color: #1976D2;
  display: block;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.student-preview {
  border: 2rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.student-card {
  display: flex;
  align-items: center;
}

.student-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.3);
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
  display: block;
  margin-bottom: 8rpx;
}

.student-id {
  font-size: 26rpx;
  color: #4FC3F7;
  font-weight: 500;
  display: block;
  margin-bottom: 5rpx;
}

.student-grade,
.student-subjects,
.student-school {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 3rpx;
}

.student-classes {
  font-size: 24rpx;
  color: #9C27B0;
  display: block;
  margin-bottom: 3rpx;
  font-weight: 500;
}

.preview-placeholder {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 26rpx;
}

.button-container {
  margin-bottom: 30rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 20rpx rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(25, 118, 210, 0.4);
}

.submit-btn:disabled {
  background: #ccc;
  box-shadow: none;
}

.submit-btn.loading {
  background: #ccc;
}

.batch-submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(156, 39, 176, 0.3);
  transition: all 0.3s ease;
}

.batch-submit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 10rpx rgba(156, 39, 176, 0.4);
}

.batch-submit-btn:disabled {
  background: #ccc;
  box-shadow: none;
}

.batch-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(25, 118, 210, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.section-title {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
}

.clear-batch {
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-batch:active {
  transform: scale(0.95);
}

.batch-items {
  padding: 30rpx;
}

.batch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  margin-bottom: 15rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: all 0.3s ease;
}

.batch-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.batch-item-info {
  flex: 1;
}

.batch-student-name {
  font-size: 28rpx;
  color: #1976D2;
  font-weight: 500;
  display: block;
  margin-bottom: 5rpx;
}

.batch-student-id {
  font-size: 24rpx;
  color: #666;
}

.batch-item-actions {
  display: flex;
  gap: 15rpx;
}

.edit-btn,
.remove-btn {
  font-size: 28rpx;
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.edit-btn {
  background: linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%);
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.3);
}

.edit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.4);
}

.remove-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

.remove-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.4);
}

/* 成绩录入相关样式 */
.toggle-item {
  background: rgba(248, 250, 255, 0.7);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.05);
}

.score-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.section-desc {
  font-size: 24rpx;
  color: #1976D2;
  margin-bottom: 20rpx;
  text-align: center;
  font-weight: 500;
}

.score-item {
  background: rgba(255, 255, 255, 0.9);
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
  margin-bottom: 15rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid rgba(25, 118, 210, 0.1);
}

.subject-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #1976D2;
}

.remove-score {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5rpx;
  border-radius: 50%;
  width: 36rpx;
  height: 36rpx;
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
  font-size: 26rpx;
  color: #1976D2;
  width: 120rpx;
  margin-right: 15rpx;
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
  width: 120rpx;
  text-align: center;
  font-weight: bold;
  color: #4FC3F7;
}

.date-picker {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid rgba(25, 118, 210, 0.2);
  border-radius: 8rpx;
  padding: 0 15rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: rgba(248, 250, 255, 0.7);
  transition: all 0.3s ease;
}

.date-picker:active {
  background: rgba(230, 240, 255, 0.9);
}

.add-score-btn {
  text-align: center;
  padding: 20rpx;
  border: 2rpx dashed #4FC3F7;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10rpx;
}

.add-score-btn:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 10rpx rgba(79, 195, 247, 0.2);
}

.add-score-text {
  font-size: 28rpx;
  color: #4FC3F7;
  font-weight: 500;
}

/* 动画效果 */
.animated-card {
  animation: fadeIn 0.3s ease-in-out;
}

.animated-section {
  animation: fadeIn 0.3s ease-in-out;
}

.animated-tag {
  animation: fadeIn 0.3s ease-in-out;
}

.animated-modal {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
</file_content>