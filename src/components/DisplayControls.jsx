import SoundControl from './SoundControl';
import ThemeControl from './ThemeControl';

export default function DisplayControls() {
  return (
    <div className="display-controls">
      <ThemeControl />
      <SoundControl />
    </div>
  );
}
