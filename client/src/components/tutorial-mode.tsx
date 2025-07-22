import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, PlayCircle, Target, BookOpen, X } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
  highlight?: string;
  expectedState?: any;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FretMagic!',
    description: 'This interactive tutorial will guide you through all the features. Let\'s start by learning the basics of the fretboard visualization.',
    action: 'Click Next to continue'
  },
  {
    id: 'guitar-selection',
    title: 'Choose Your Guitar',
    description: 'First, select your guitar type. You can choose between 6, 7, or 8-string guitars. Each will show the appropriate fretboard layout.',
    target: 'guitar-controls',
    action: 'Try selecting different guitar types'
  },
  {
    id: 'tuning-selection',
    title: 'Pick a Tuning',
    description: 'Choose from preset tunings or create your own custom tuning. The fretboard will update automatically to show your tuning.',
    target: 'tuning-controls',
    action: 'Select a different tuning like Drop D'
  },
  {
    id: 'scale-selection',
    title: 'Select a Scale',
    description: 'Choose from various scales and modes. The fretboard will highlight all the notes in your selected scale.',
    target: 'scale-controls',
    action: 'Try changing to Minor Pentatonic'
  },
  {
    id: 'root-note',
    title: 'Set Your Root Note',
    description: 'The root note determines which key you\'re playing in. Change it to see how the scale pattern moves across the fretboard.',
    target: 'root-note-control',
    action: 'Try changing the root note to G'
  },
  {
    id: 'display-modes',
    title: 'Display Options',
    description: 'Toggle between showing note names (C, D, E) or intervals (1, 2, 3). You can also hide/show different elements.',
    target: 'display-controls',
    action: 'Switch to interval mode'
  },
  {
    id: 'fretboard-reading',
    title: 'Reading the Fretboard',
    description: 'Yellow circles are root notes, blue circles are scale notes. The larger dots on certain frets are position markers.',
    target: 'fretboard-container',
    action: 'Look at the fretboard patterns'
  },
  {
    id: 'export-features',
    title: 'Export Your Work',
    description: 'Save your fretboard configurations as PNG images or PDF documents for reference or sharing.',
    target: 'export-controls',
    action: 'Try exporting a PNG'
  },
  {
    id: 'practice-mode',
    title: 'Practice Mode',
    description: 'Hide note names and test your knowledge! Use the display controls to quiz yourself on scale patterns.',
    target: 'display-controls',
    action: 'Hide scale notes and try to identify them'
  },
  {
    id: 'completion',
    title: 'Tutorial Complete!',
    description: 'You\'ve learned the basics of FretMagic! Experiment with different combinations and discover new musical possibilities.',
    action: 'Start exploring on your own'
  }
];

interface TutorialModeProps {
  isOpen: boolean;
  onClose: () => void;
  currentState?: any;
}

export function TutorialMode({ isOpen, onClose, currentState }: TutorialModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsActive(true);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsActive(false);
    onClose();
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    // Highlight target elements
    if (isActive && currentStepData.target) {
      const element = document.getElementById(currentStepData.target);
      if (element) {
        element.classList.add('tutorial-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Clean up previous highlights
      return () => {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
          el.classList.remove('tutorial-highlight');
        });
      };
    }
  }, [isActive, currentStep, currentStepData.target]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {isActive && (
        <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />
      )}

      {/* Tutorial Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Interactive Tutorial
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
              <Badge variant="outline">
                {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>

            {/* Step content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
              
              {currentStepData.action && (
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{currentStepData.action}</span>
                </div>
              )}
            </div>

            {/* Step navigator */}
            <div className="flex flex-wrap gap-1 pt-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-6 h-6 rounded-full text-xs font-medium transition-colors ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Start Exploring
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TutorialButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Tutorial
      </Button>
      
      <TutorialMode
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}