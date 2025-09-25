import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Download, ExternalLink, Check } from 'lucide-react';
import { createShareableUrl, createShareableImage, ShareableConfig, ExportMetadata } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ShareControlsProps {
  rootNote: string;
  scaleType: string;
  guitarType: number;
  tuning: string[];
  showNotes: boolean;
  showIntervals: boolean;
  showFretNumbers: boolean;
  fretRange: number;
  displayMode: 'notes' | 'intervals' | 'degrees';
  currentScale: {
    name: string;
    notes: string[];
    pattern: string;
  };
}

export default function ShareControls({
  rootNote,
  scaleType,
  guitarType,
  tuning,
  showNotes,
  showIntervals,
  showFretNumbers,
  fretRange,
  displayMode,
  currentScale
}: ShareControlsProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const generateShareUrl = () => {
    const config: ShareableConfig = {
      rootNote,
      scaleType,
      guitarType,
      tuning,
      showNotes,
      showIntervals,
      showFretNumbers,
      fretRange,
      displayMode
    };

    const url = createShareableUrl(config);
    setShareUrl(url);
    
    toast({
      title: "Share URL Generated",
      description: "You can now copy and share this link with others.",
    });
  };

  const copyToClipboard = async () => {
    if (!shareUrl) {
      generateShareUrl();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "Share URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please copy the URL manually.",
        variant: "destructive"
      });
    }
  };

  const openInNewTab = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const downloadShareableImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      if (!shareUrl) {
        generateShareUrl();
      }

      const metadata: ExportMetadata = {
        guitarType,
        tuning: tuning.slice(0, guitarType),
        scaleType,
        scaleName: currentScale.name,
        rootNote,
        timestamp: new Date().toLocaleString()
      };

      const imageDataUrl = await createShareableImage('fretboard-container', metadata, shareUrl);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `fretmagic-share-${guitarType}string-${rootNote}-${scaleType}-${Date.now()}.png`;
      link.href = imageDataUrl;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Shareable Image Downloaded",
        description: "The image includes a link back to this exact fretboard configuration.",
      });
    } catch (error) {
      console.error('Error creating shareable image:', error);
      toast({
        title: "Image Generation Failed",
        description: "Unable to create shareable image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Fretboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Configuration */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Current Configuration</div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{currentScale.name}</Badge>
            <Badge variant="outline">{rootNote} Root</Badge>
            <Badge variant="outline">{guitarType}-String</Badge>
            <Badge variant="outline">{displayMode === 'notes' ? 'Notes' : displayMode === 'degrees' ? 'Degrees' : 'Intervals'}</Badge>
            <Badge variant="outline">Frets 1-{fretRange}</Badge>
          </div>
        </div>

        {/* Share URL Generation */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={generateShareUrl}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Generate Share Link
            </Button>
            
            <Button
              onClick={downloadShareableImage}
              variant="outline"
              size="sm"
              disabled={isGeneratingImage}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingImage ? 'Generating...' : 'Share Image'}
            </Button>
          </div>

          {shareUrl && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-xs"
                  placeholder="Share URL will appear here..."
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="min-w-[80px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <Alert>
          <Share2 className="h-4 w-4" />
          <AlertDescription>
            <strong>Share Link:</strong> Preserves all current settings and allows others to view the exact same fretboard configuration.
            <br />
            <strong>Share Image:</strong> Creates a visual snapshot with an embedded link for social media sharing.
          </AlertDescription>
        </Alert>

        {/* Share Options Info */}
        <div className="text-xs text-muted-foreground">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Preserved Settings:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Scale and root note</li>
                <li>Guitar type and tuning</li>
                <li>Display preferences</li>
                <li>Fret range</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Share Methods:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Direct URL link</li>
                <li>Social media image</li>
                <li>Email or messaging</li>
                <li>Embed in websites</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}