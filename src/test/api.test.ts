import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, AnalysisData } from '../services/api';

describe('API Service', () => {
  describe('analyzeUrl', () => {
    it('should return analysis data for a valid URL', async () => {
      const url = 'https://example-saas.com';
      const result = await api.analyzeUrl(url);

      expect(result).toHaveProperty('targetAudience');
      expect(result).toHaveProperty('financialProjection');
      expect(result).toHaveProperty('executiveDirective');
      expect(result).toHaveProperty('strategicHook');
    });

    it('should return valid targetAudience structure', async () => {
      const result = await api.analyzeUrl('https://test.com');

      expect(result.targetAudience).toHaveProperty('description');
      expect(result.targetAudience).toHaveProperty('tags');
      expect(Array.isArray(result.targetAudience.tags)).toBe(true);
    });

    it('should return valid financialProjection structure', async () => {
      const result = await api.analyzeUrl('https://test.com');

      expect(result.financialProjection).toHaveProperty('description');
      expect(result.financialProjection).toHaveProperty('tags');
      expect(Array.isArray(result.financialProjection.tags)).toBe(true);
    });

    it('should return valid executiveDirective structure', async () => {
      const result = await api.analyzeUrl('https://test.com');

      expect(result.executiveDirective).toHaveProperty('description');
      expect(result.executiveDirective).toHaveProperty('tags');
      expect(Array.isArray(result.executiveDirective.tags)).toBe(true);
    });

    it('should return a non-empty strategic hook', async () => {
      const result = await api.analyzeUrl('https://test.com');

      expect(typeof result.strategicHook).toBe('string');
      expect(result.strategicHook.length).toBeGreaterThan(0);
    });
  });

  describe('getAvatars', () => {
    it('should return an array of avatars', async () => {
      const avatars = await api.getAvatars();

      expect(Array.isArray(avatars)).toBe(true);
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('should have required avatar properties', async () => {
      const avatars = await api.getAvatars();
      const avatar = avatars[0];

      expect(avatar).toHaveProperty('id');
      expect(avatar).toHaveProperty('name');
      expect(avatar).toHaveProperty('role');
      expect(avatar).toHaveProperty('image');
      expect(avatar).toHaveProperty('category');
      expect(avatar).toHaveProperty('price');
      expect(avatar).toHaveProperty('trust');
    });
  });

  describe('getTemplates', () => {
    it('should return an array of templates', async () => {
      const templates = await api.getTemplates();

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should have required template properties', async () => {
      const templates = await api.getTemplates();
      const template = templates[0];

      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('title');
      expect(template).toHaveProperty('category');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('price');
      expect(template).toHaveProperty('metrics');
    });
  });

  describe('renderVideo', () => {
    it('should return progress 100 for mock render', async () => {
      const result = await api.renderVideo('avatar-1', 'test script', 'Instagram');

      expect(result).toHaveProperty('progress');
      expect(result.progress).toBe(100);
      expect(result).toHaveProperty('url');
    });
  });

  describe('purchaseTemplate', () => {
    it('should return success true and orderId', async () => {
      const result = await api.purchaseTemplate('template-1');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('orderId');
      expect(result.success).toBe(true);
      expect(typeof result.orderId).toBe('string');
    });

    it('should generate orderId with correct prefix', async () => {
      const result = await api.purchaseTemplate('template-1');

      expect(result.orderId).toMatch(/^ORD-\d+$/);
    });
  });
});
