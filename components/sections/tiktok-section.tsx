"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Play, ExternalLink, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function TikTokSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const socialStats = [
    { icon: Heart, value: "2.5K", label: t('tiktok.socialStats.likes') },
    { icon: MessageCircle, value: "150", label: t('tiktok.socialStats.comments') },
    { icon: Share2, value: "500", label: t('tiktok.socialStats.shares') },
  ]

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            {t('tiktok.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('tiktok.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('tiktok.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden border-2 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('tiktok.username')}</h3>
                    <p className="text-sm opacity-90">{t('tiktok.tagline')}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  TikTok
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* TikTok Video Embed */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-green-500 to-green-600"
                >
                  {/* TikTok Video Content */}
                  <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                    {mounted ? (
                      <div className="w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center">
                        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                          <blockquote 
                            className="tiktok-embed w-full" 
                            cite="https://www.tiktok.com/@freemanmovers/video/7477648802627751223"
                            data-video-id="7477648802627751223"
                            style={{ minHeight: '400px' }}
                          >
                            <section>
                              <a target="_blank" href="https://www.tiktok.com/@freemanmovers">@freemanmovers</a>
                            </section>
                          </blockquote>
                          <script async src="https://www.tiktok.com/embed.js"></script>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                        <div className="text-center px-4">
                          <motion.div 
                            className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl border border-white/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" />
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          >
                            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Watch Our Latest Video</h4>
                            <p className="text-white/90 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">Professional moving services in action - see our team at work!</p>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.7, duration: 0.6 }}
                          >
                            <Button 
                              size="lg"
                              className="bg-white text-green-600 hover:bg-white/90 font-semibold px-6 sm:px-8 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                              onClick={() => window.open('https://www.tiktok.com/@freemanmovers/video/7477648802627751223', '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Watch on TikTok
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ 
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30"
                    >
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{ 
                        y: [10, -10, 10],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Social Stats */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    {socialStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                        className="flex items-center gap-2"
                      >
                        <stat.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {stat.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('tiktok.share')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 
 
 







