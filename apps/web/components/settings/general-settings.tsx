'use client'

import { motion } from 'framer-motion'
import { 
  Globe, 
  Clock, 
  Calendar,
  Download,
  Upload,
  Save,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    appName: 'Ultimate AI Dashboard',
    appUrl: 'https://dashboard.example.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'en-US',
    autoSave: true,
    darkMode: true,
    animations: true
  })

  return (
    <div className="space-y-8">
      {/* Application Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Application Settings</h3>
        
        <div className="space-y-6">
          {/* App Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Application Name
            </label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder-gray-500 focus:outline-none transition-all"
            />
          </div>

          {/* App URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Application URL
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={settings.appUrl}
                onChange={(e) => setSettings({ ...settings, appUrl: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder-gray-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Timezone
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 text-white focus:outline-none transition-all appearance-none"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date Format
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={settings.dateFormat}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 text-white focus:outline-none transition-all appearance-none"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Preferences</h3>
        
        <div className="space-y-4">
          {[
            { key: 'autoSave', label: 'Auto-save changes', description: 'Automatically save changes as you make them' },
            { key: 'darkMode', label: 'Dark mode', description: 'Use dark theme across the application' },
            { key: 'animations', label: 'Enable animations', description: 'Show smooth transitions and effects' }
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-sm font-medium text-white">{pref.label}</h4>
                <p className="text-xs text-gray-400 mt-1">{pref.description}</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [pref.key]: !settings[pref.key as keyof typeof settings] })}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings[pref.key as keyof typeof settings] 
                    ? 'bg-gradient-to-r from-gray-600 to-slate-700' 
                    : 'bg-gray-700'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  animate={{
                    x: settings[pref.key as keyof typeof settings] ? 24 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Data Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <Download className="w-8 h-8 text-gray-400 group-hover:text-white mb-3 transition-colors" />
            <h4 className="text-lg font-medium text-white mb-1">Export Data</h4>
            <p className="text-sm text-gray-400">Download all your data in JSON format</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-white mb-3 transition-colors" />
            <h4 className="text-lg font-medium text-white mb-1">Import Data</h4>
            <p className="text-sm text-gray-400">Restore data from a backup file</p>
          </motion.button>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-medium">Warning</p>
              <p className="text-xs text-gray-400 mt-1">
                Importing data will overwrite your current settings. Make sure to export a backup first.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}