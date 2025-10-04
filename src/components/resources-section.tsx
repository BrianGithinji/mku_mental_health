import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Phone, MessageCircle, Globe, Heart, Shield, HelpCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'crisis' | 'support' | 'educational' | 'community';
  contact?: string;
  website?: string;
  available: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Emergency Contact',
    description: 'Immediate support and crisis intervention for MKU students',
    type: 'crisis',
    contact: '+254734434907',
    available: '24/7',
  },
  {
    id: '2',
    title: 'Kenya Mental Health Helpline',
    description: 'Free, confidential crisis counseling and mental health crisis services',
    type: 'crisis',
    contact: '0800 720 000',
    available: '24/7',
  },
  {
    id: '3',
    title: 'MKU Counseling Center',
    description: 'Professional counseling services for Mount Kenya University students',
    type: 'crisis',
    contact: '+254 709 153 204',
    available: 'Business hours',
  },
  {
    id: '4',
    title: 'Kenya Association of Professional Counsellors',
    description: 'Find licensed counsellors and mental health professionals in Kenya',
    type: 'support',
    website: 'kapc.or.ke',
    available: 'Business hours',
  },
  {
    id: '5',
    title: 'Ministry of Health - Mental Health',
    description: 'Government mental health resources and information for Kenyan citizens',
    type: 'educational',
    website: 'health.go.ke',
    available: 'Always available',
  },
  {
    id: '6',
    title: 'Befrienders Kenya',
    description: 'Emotional support and suicide prevention services in Kenya',
    type: 'support',
    contact: '+254 722 178 177',
    available: '24/7',
  },
  {
    id: '7',
    title: 'Mindfulness-Based Stress Reduction',
    description: 'Evidence-based mindfulness techniques for stress and anxiety',
    type: 'educational',
    website: 'palousemindfulness.com',
    available: 'Self-paced',
  },
];

const copingStrategies = [
  {
    title: 'Deep Breathing',
    description: 'Slow, deep breaths to activate your parasympathetic nervous system',
    steps: ['Inhale for 4 counts', 'Hold for 4 counts', 'Exhale for 6 counts', 'Repeat 5-10 times'],
  },
  {
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to ground yourself in the present moment',
    steps: ['Name 5 things you can see', 'Name 4 things you can touch', 'Name 3 things you can hear', 'Name 2 things you can smell', 'Name 1 thing you can taste'],
  },
  {
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups',
    steps: ['Start with your toes', 'Tense for 5 seconds', 'Release and notice the relaxation', 'Move up through your body'],
  },
];

export function ResourcesSection() {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'crisis': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'support': return <Heart className="h-5 w-5 text-blue-500" />;
      case 'educational': return <HelpCircle className="h-5 w-5 text-green-500" />;
      case 'community': return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'crisis': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'support': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'educational': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800 dark:text-red-300">Crisis Support Available 24/7</AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-400">
          If you're having thoughts of self-harm or suicide, please reach out immediately. You are not alone.
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button size="sm" variant="destructive" className="h-8 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call +254734434907
            </Button>
            <Button size="sm" variant="outline" className="h-8 border-red-300 text-red-700 hover:bg-red-100 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call 0800 720 000
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Crisis Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Phone className="h-5 w-5" />
            Crisis Support
          </CardTitle>
          <CardDescription>
            Immediate help when you need it most
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.filter(r => r.type === 'crisis').map((resource) => (
              <div key={resource.id} className="p-3 sm:p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getResourceIcon(resource.type)}
                      <h4 className="font-medium text-sm sm:text-base text-red-800 dark:text-red-300">{resource.title}</h4>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs" variant="secondary">
                        {resource.available}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 mb-2">{resource.description}</p>
                    {resource.contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300">{resource.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support & Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-500" />
            Support & Resources
          </CardTitle>
          <CardDescription>
            Professional help and educational materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {resources.filter(r => r.type !== 'crisis').map((resource) => (
              <div key={resource.id} className="p-3 sm:p-4 border rounded-lg">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getResourceIcon(resource.type)}
                    <h4 className="font-medium text-sm sm:text-base">{resource.title}</h4>
                    <Badge className={`${getResourceColor(resource.type)} text-xs`} variant="secondary">
                      {resource.type}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{resource.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>Available: {resource.available}</span>
                      {resource.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {resource.website}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs sm:w-auto">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coping Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Quick Coping Strategies
          </CardTitle>
          <CardDescription>
            Techniques you can use right now to manage difficult feelings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="p-3 sm:p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                <h4 className="font-medium text-sm sm:text-base text-green-800 dark:text-green-300 mb-2">{strategy.title}</h4>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mb-3">{strategy.description}</p>
                <div className="space-y-1">
                  {strategy.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-2 text-xs sm:text-sm">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <span className="text-green-700 dark:text-green-400">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-1">
                Important Disclaimer
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                This app is designed to supplement, not replace, professional mental health treatment. 
                If you're experiencing a mental health crisis or persistent symptoms, please consult 
                with a qualified mental health professional. The resources provided here are for 
                informational purposes and should not be considered medical advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}