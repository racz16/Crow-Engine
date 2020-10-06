import { Component } from '../component/Component';
import { Audio } from '../resource/Audio';
import { Engine } from '../core/Engine';
import { GlConstants } from '../webgl/GlConstants';
import { RenderingPipeline } from '../rendering/RenderingPipeline';

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
        document.getElementById('vendor').textContent = GlConstants.UNMASKED_VENDOR;
        document.getElementById('renderer').textContent = GlConstants.UNMASKED_RENDERER;
        (document.getElementById('ibl') as HTMLInputElement).checked = true;
        document.getElementById('ibl').onclick = this.toggleIbl;
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

    private toggleIbl(): void {
        const useIbl = (document.getElementById('ibl') as HTMLInputElement).checked;
        Engine.getRenderingPipeline().getParameters().set(RenderingPipeline.PBR_USE_IBL, useIbl);
    }

    private unmute(): void {
        document.getElementById('mute').style.display = 'inline';
        document.getElementById('unmute').style.display = 'none';
        Audio.setVolume(1);
    }

    public updateComponent(): void {
        this.textNode.nodeValue = Engine.getTimeManager().getFps() + '';
        document.getElementById('faces').textContent = Engine.getRenderingPipeline().getRenderedFaceCount() + '';
        document.getElementById('elements').textContent = Engine.getRenderingPipeline().getRenderedElementCount() + '';
    }

}