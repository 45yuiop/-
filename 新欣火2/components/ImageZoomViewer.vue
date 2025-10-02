<template>
  <view v-if="visible" class="image-zoom-viewer" @click="closeViewer">
    <view class="viewer-content" @click.stop>
      <!-- 顶部工具栏 -->
      <view class="viewer-toolbar">
        <view class="tool-btn" @click="closeViewer">
          <text class="tool-icon">×</text>
        </view>
        <view class="tool-btn" @click="toggleZoom">
          <text class="tool-icon">{{ scale > 1 ? '−' : '+' }}</text>
        </view>
        <view class="image-counter">{{ currentIndex + 1 }} / {{ images.length }}</view>
      </view>
      
      <!-- 图片容器 -->
      <view class="image-container">
        <view 
          class="image-wrapper"
          :style="imageWrapperStyle"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @dblclick="handleDoubleClick"
        >
          <image 
            :src="currentImage" 
            class="zoom-image" 
            mode="aspectFit"
            @load="onImageLoad"
            @error="onImageError"
          />
        </view>
      </view>
      
      <!-- 底部指示器 -->
      <view v-if="images.length > 1" class="viewer-indicator">
        <view 
          v-for="(image, index) in images" 
          :key="index"
          class="indicator-dot"
          :class="{ active: index === currentIndex }"
          @click="switchImage(index)"
        ></view>
      </view>
      
      <!-- 缩放提示 -->
      <view v-if="scale > 1" class="zoom-hint">
        <text>双指缩放 • 单指移动 • 双击重置</text>
      </view>
      
      <!-- 切换提示 -->
      <view v-if="scale <= 1 && images.length > 1" class="switch-hint">
        <text>左右滑动切换图片 • 双击放大</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ImageZoomViewer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scale: 1,
      translateX: 0,
      translateY: 0,
      lastScale: 1,
      lastTranslateX: 0,
      lastTranslateY: 0,
      startDistance: 0,
      startX: 0,
      startY: 0,
      isMoving: false,
      imageWidth: 0,
      imageHeight: 0,
      containerWidth: 0,
      containerHeight: 0,
      touchStartTime: 0,
      isDoubleTap: false
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || ''
    },
    imageWrapperStyle() {
      return {
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`,
        transition: this.isMoving ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetZoom()
        this.$nextTick(() => {
          this.initContainerSize()
        })
      }
    },
    currentIndex() {
      this.resetZoom()
      this.$nextTick(() => {
        this.initContainerSize()
      })
    }
  },
  methods: {
    // 初始化容器尺寸
    initContainerSize() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.image-container').boundingClientRect((rect) => {
        if (rect) {
          this.containerWidth = rect.width
          this.containerHeight = rect.height
        }
      }).exec()
    },
    
    // 图片加载完成
    onImageLoad(e) {
      const { width, height } = e.detail
      this.imageWidth = width
      this.imageHeight = height
    },
    
    // 图片加载错误
    onImageError() {
      uni.showToast({
        title: '图片加载失败',
        icon: 'none'
      })
    },
    
    // 重置缩放
    resetZoom() {
      this.scale = 1
      this.translateX = 0
      this.translateY = 0
      this.lastScale = 1
      this.lastTranslateX = 0
      this.lastTranslateY = 0
    },
    
    // 切换缩放
    toggleZoom() {
      if (this.scale > 1) {
        this.resetZoom()
      } else {
        this.scale = 2
        this.lastScale = 2
      }
    },
    
    // 关闭查看器
    closeViewer() {
      this.$emit('close')
    },
    
    // 切换图片
    switchImage(index) {
      if (index >= 0 && index < this.images.length) {
        this.$emit('switch', index)
      }
    },
    
    // 切换到上一张图片
    switchToPreviousImage() {
      const newIndex = this.currentIndex - 1
      if (newIndex >= 0) {
        this.switchImage(newIndex)
      }
    },
    
    // 切换到下一张图片
    switchToNextImage() {
      const newIndex = this.currentIndex + 1
      if (newIndex < this.images.length) {
        this.switchImage(newIndex)
      }
    },
    
    // 处理触摸开始
    handleTouchStart(e) {
      const touches = e.touches
      this.touchStartTime = Date.now()
      
      if (touches.length === 1) {
        // 单指触摸 - 移动或滑动切换
        this.startX = touches[0].clientX
        this.startY = touches[0].clientY
        this.isMoving = true
      } else if (touches.length === 2) {
        // 双指触摸 - 缩放
        this.startDistance = this.getDistance(touches[0], touches[1])
        this.lastScale = this.scale
        this.isMoving = true
      }
    },
    
    // 处理触摸移动
    handleTouchMove(e) {
      if (!this.isMoving) return
      
      const touches = e.touches
      
      if (touches.length === 1) {
        // 单指移动
        const deltaX = touches[0].clientX - this.startX
        const deltaY = touches[0].clientY - this.startY
        
        // 如果图片没有放大，则处理左右滑动切换
        if (this.scale <= 1) {
          // 水平滑动距离大于垂直滑动距离，且水平滑动距离足够大时，认为是切换图片的意图
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            // 不处理图片移动，只记录滑动距离用于切换判断
            return
          }
        }
        
        this.translateX = this.lastTranslateX + deltaX
        this.translateY = this.lastTranslateY + deltaY
        
        // 限制移动范围
        this.limitTranslation()
      } else if (touches.length === 2) {
        // 双指缩放
        const currentDistance = this.getDistance(touches[0], touches[1])
        const scale = (currentDistance / this.startDistance) * this.lastScale
        
        // 限制缩放范围
        this.scale = Math.max(1, Math.min(4, scale))
      }
    },
    
    // 处理触摸结束
    handleTouchEnd(e) {
      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - this.touchStartTime
      
      // 检测双击
      if (touchDuration < 300 && e.touches.length === 0) {
        if (this.isDoubleTap) {
          this.handleDoubleClick()
          this.isDoubleTap = false
        } else {
          this.isDoubleTap = true
          setTimeout(() => {
            this.isDoubleTap = false
          }, 300)
        }
      }
      
      // 处理左右滑动切换图片
      if (this.scale <= 1 && e.touches.length === 0) {
        const deltaX = e.changedTouches[0].clientX - this.startX
        const deltaY = e.changedTouches[0].clientY - this.startY
        
        // 水平滑动距离大于垂直滑动距离，且水平滑动距离足够大时，切换图片
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
          if (deltaX > 0) {
            // 向右滑动，显示上一张图片
            this.switchToPreviousImage()
          } else {
            // 向左滑动，显示下一张图片
            this.switchToNextImage()
          }
        }
      }
      
      this.isMoving = false
      this.lastTranslateX = this.translateX
      this.lastTranslateY = this.translateY
      this.lastScale = this.scale
    },
    
    // 处理双击
    handleDoubleClick() {
      if (this.scale > 1) {
        this.resetZoom()
      } else {
        this.scale = 2
        this.lastScale = 2
      }
    },
    
    // 计算两点距离
    getDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      return Math.sqrt(dx * dx + dy * dy)
    },
    
    // 限制移动范围
    limitTranslation() {
      const maxTranslateX = (this.scale - 1) * this.containerWidth / 2
      const maxTranslateY = (this.scale - 1) * this.containerHeight / 2
      
      this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX))
      this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY))
    }
  }
}
</script>

<style scoped>
.image-zoom-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.viewer-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.viewer-toolbar {
  position: absolute;
  top: 30rpx;
  left: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20rpx;
  z-index: 10;
  background: none;
  padding: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.image-counter {
  color: white;
  font-size: 28rpx;
  background: rgba(0, 0, 0, 0.6);
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  backdrop-filter: blur(10px);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.tool-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tool-btn:active {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(0.95);
}

.tool-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  cursor: grab;
  will-change: transform;
}

.image-wrapper:active {
  cursor: grabbing;
}

.zoom-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  border-radius: 8rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.viewer-indicator {
  position: absolute;
  bottom: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 24rpx;
  z-index: 10;
}

.indicator-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.indicator-dot.active {
  background: white;
  transform: scale(1.2);
}

.indicator-dot:active {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.1);
}

.zoom-hint {
  position: absolute;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.3s ease;
}

.switch-hint {
  position: absolute;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
