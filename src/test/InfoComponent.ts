import { Component } from '../component/Component';
import { Audio } from '../resource/Audio';
import { Gl } from '../webgl/Gl';
import { Engine } from '../core/Engine';

export class InfoComponent extends Component {

    private textNode: Text;

    public constructor() {
        super();
        const htmlElement = document.getElementById('fps');
        this.textNode = document.createTextNode('');
        htmlElement.appendChild(this.textNode);
        document.getElementById('mute').onclick = this.mute;
        document.getElementById('unmute').onclick = this.unmute;
        document.getElementById('expand').onclick = this.toggleFullscreen;
        document.getElementById('compress').onclick = this.toggleFullscreen;
        document.getElementById('vendor').textContent = Gl.getVendor();
        document.getElementById('renderer').textContent = Gl.getRenderer();
    }

    private mute(): void {
        document.getElementById('mute').style.display = 'none';
        document.getElementById('unmute').style.display = 'inline';
        Audio.setVolume(0);
    }

    private toggleFullscreen(): void {
        const inFullscreen = !!document.fullscreenElement;
        document.getElementById('expand').style.display = !inFullscreen ? 'inline' : 'none';
        document.getElementById('compress').style.display = inFullscreen ? 'inline' : 'none';
        if (inFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    private unmute(): void {
        document.getElementById('mute').style.display = 'inline';
        document.getElementById('unmute').style.display = 'none';
        Audio.setVolume(1);
    }

    protected updateComponent(): void {
        this.textNode.nodeValue = Engine.getTimeManager().getFps() + '';
    }

}