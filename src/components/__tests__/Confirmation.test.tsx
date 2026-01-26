import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Modal } from 'antd'
import {
  confirmation,
  confirmWarning,
  confirmError,
  confirmSuccess,
  confirmInfo,
  type ConfirmationOptions,
} from '../Confirmation'

// Mock antd Modal
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Modal: {
      confirm: vi.fn((options) => {
        // Simulate modal behavior
        return {
          destroy: vi.fn(),
          update: vi.fn(),
        }
      }),
    },
  }
})

describe('Confirmation Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Confirmation', () => {
    it('exports confirmation function', () => {
      expect(typeof confirmation).toBe('function')
    })

    it('calls confirmation with string message', () => {
      expect(() => confirmation('Test message')).not.toThrow()
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('calls confirmation with options object', () => {
      const options: ConfirmationOptions = {
        message: 'Test message',
        title: 'Test Title',
      }
      expect(() => confirmation(options)).not.toThrow()
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles confirmation with default options', async () => {
      const promise = confirmation('Test message')
      expect(promise).toBeInstanceOf(Promise)
    })

    it('resolves to true when confirmed', async () => {
      let resolveFn: (value: boolean) => void = () => {}
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        setTimeout(() => {
          if (options.onOk) {
            options.onOk()
          }
        }, 10)
        return { destroy: vi.fn() }
      })

      const result = await confirmation('Test')
      expect(result).toBe(true)
    })

    it('resolves to false when cancelled', async () => {
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        setTimeout(() => {
          if (options.onCancel) {
            options.onCancel()
          }
        }, 10)
        return { destroy: vi.fn() }
      })

      const result = await confirmation('Test')
      expect(result).toBe(false)
    })
  })

  describe('Confirmation Types', () => {
    it('handles info type confirmation', () => {
      const options: ConfirmationOptions = {
        message: 'Info message',
        type: 'info',
      }
      confirmation(options)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles warning type confirmation', () => {
      const options: ConfirmationOptions = {
        message: 'Warning message',
        type: 'warning',
      }
      confirmation(options)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles error type confirmation', () => {
      const options: ConfirmationOptions = {
        message: 'Error message',
        type: 'error',
      }
      confirmation(options)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles success type confirmation', () => {
      const options: ConfirmationOptions = {
        message: 'Success message',
        type: 'success',
      }
      confirmation(options)
      expect(Modal.confirm).toHaveBeenCalled()
    })
  })

  describe('Confirmation Options', () => {
    it('handles custom title', () => {
      confirmation({
        message: 'Test',
        title: 'Custom Title',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom ok text', () => {
      confirmation({
        message: 'Test',
        okText: 'Confirm',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom cancel text', () => {
      confirmation({
        message: 'Test',
        cancelText: 'Abort',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom width', () => {
      confirmation({
        message: 'Test',
        width: 800,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles description', () => {
      confirmation({
        message: 'Test',
        description: 'This is a description',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles showCancel false', () => {
      confirmation({
        message: 'Test',
        showCancel: false,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom icon', () => {
      confirmation({
        message: 'Test',
        icon: <span>Custom Icon</span>,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles onOk callback', async () => {
      const onOk = vi.fn()
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        if (options.onOk) {
          options.onOk()
        }
        return { destroy: vi.fn() }
      })

      await confirmation({
        message: 'Test',
        onOk,
      })
      expect(onOk).toHaveBeenCalled()
    })

    it('handles onCancel callback', async () => {
      const onCancel = vi.fn()
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        if (options.onCancel) {
          options.onCancel()
        }
        return { destroy: vi.fn() }
      })

      await confirmation({
        message: 'Test',
        onCancel,
      })
      expect(onCancel).toHaveBeenCalled()
    })

    it('handles async onOk callback', async () => {
      const onOk = vi.fn().mockResolvedValue(undefined)
      vi.mocked(Modal.confirm).mockImplementation(async (options: any) => {
        if (options.onOk) {
          await options.onOk()
        }
        return { destroy: vi.fn() }
      })

      await confirmation({
        message: 'Test',
        onOk,
      })
      expect(onOk).toHaveBeenCalled()
    })

    it('handles onOk callback error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onOk = vi.fn().mockRejectedValue(new Error('Test error'))
      vi.mocked(Modal.confirm).mockImplementation(async (options: any) => {
        try {
          if (options.onOk) {
            await options.onOk()
          }
        } catch (error) {
          // Error handled
        }
        return { destroy: vi.fn() }
      })

      await confirmation({
        message: 'Test',
        onOk,
      })
      expect(onOk).toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  describe('Auto Close', () => {
    it('handles auto close with countdown', async () => {
      vi.useFakeTimers()
      const promise = confirmation({
        message: 'Test',
        autoClose: 5,
      })

      vi.advanceTimersByTime(5000)
      await promise
      expect(Modal.confirm).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('cancels auto close when cancelled', async () => {
      vi.useFakeTimers()
      let cancelCalled = false
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        setTimeout(() => {
          if (options.onCancel && !cancelCalled) {
            cancelCalled = true
            options.onCancel()
          }
        }, 2000)
        return { destroy: vi.fn() }
      })

      const promise = confirmation({
        message: 'Test',
        autoClose: 5,
      })

      vi.advanceTimersByTime(2000)
      await promise
      vi.useRealTimers()
    })
  })

  describe('Convenience Functions', () => {
    it('confirmWarning works correctly', () => {
      const promise = confirmWarning('Warning message')
      expect(promise).toBeInstanceOf(Promise)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('confirmError works correctly', () => {
      const promise = confirmError('Error message')
      expect(promise).toBeInstanceOf(Promise)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('confirmSuccess works correctly', () => {
      const promise = confirmSuccess('Success message')
      expect(promise).toBeInstanceOf(Promise)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('confirmInfo works correctly', () => {
      const promise = confirmInfo('Info message')
      expect(promise).toBeInstanceOf(Promise)
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('convenience functions accept options', () => {
      confirmWarning('Warning', { title: 'Custom Title' })
      confirmError('Error', { width: 600 })
      confirmSuccess('Success', { okText: 'OK' })
      confirmInfo('Info', { showCancel: false })
      expect(Modal.confirm).toHaveBeenCalledTimes(4)
    })
  })

  describe('Advanced Options', () => {
    it('handles closable false', () => {
      confirmation({
        message: 'Test',
        closable: false,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles maskClosable false', () => {
      confirmation({
        message: 'Test',
        maskClosable: false,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles centered false', () => {
      confirmation({
        message: 'Test',
        centered: false,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom zIndex', () => {
      confirmation({
        message: 'Test',
        zIndex: 2000,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles custom footer', () => {
      confirmation({
        message: 'Test',
        footer: <div>Custom Footer</div>,
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles okType danger', () => {
      confirmation({
        message: 'Test',
        okType: 'danger',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('handles okType default', () => {
      confirmation({
        message: 'Test',
        okType: 'default',
      })
      expect(Modal.confirm).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty message', () => {
      expect(() => confirmation('')).not.toThrow()
    })

    it('handles very long message', () => {
      const longMessage = 'A'.repeat(1000)
      expect(() => confirmation(longMessage)).not.toThrow()
    })

    it('handles special characters in message', () => {
      expect(() => confirmation('Test <>&"\'message')).not.toThrow()
    })

    it('handles multiple rapid confirmations', () => {
      for (let i = 0; i < 10; i++) {
        confirmation(`Test ${i}`)
      }
      expect(Modal.confirm).toHaveBeenCalledTimes(10)
    })

    it('handles confirmation with all options', () => {
      const allOptions: ConfirmationOptions = {
        title: 'Full Test',
        message: 'Complete test message',
        type: 'warning',
        okText: 'Confirm',
        cancelText: 'Cancel',
        okType: 'danger',
        width: 600,
        showCancel: true,
        description: 'Full description',
        autoClose: 10,
        closable: true,
        maskClosable: true,
        centered: true,
        zIndex: 1500,
        onOk: vi.fn(),
        onCancel: vi.fn(),
      }
      expect(() => confirmation(allOptions)).not.toThrow()
    })
  })

  describe('Modal Lifecycle', () => {
    it('destroys modal after confirmation', async () => {
      const destroy = vi.fn()
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        setTimeout(() => {
          if (options.onOk) {
            options.onOk()
          }
        }, 10)
        return { destroy }
      })

      await confirmation('Test')
      expect(destroy).toHaveBeenCalled()
    })

    it('destroys modal after cancellation', async () => {
      const destroy = vi.fn()
      vi.mocked(Modal.confirm).mockImplementation((options: any) => {
        setTimeout(() => {
          if (options.onCancel) {
            options.onCancel()
          }
        }, 10)
        return { destroy }
      })

      await confirmation('Test')
      expect(destroy).toHaveBeenCalled()
    })
  })
})


