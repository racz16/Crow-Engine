import { Component } from "../core/Component";
import { Time } from "../core/Time";
import { Audio } from "../resource/Audio";
import { Gl } from "../webgl/Gl";

export class InfoComponent extends Component {
    private textNode: Text;

    public constructor() {
        super();
        const htmlElement = document.getElementById("fps");
        this.textNode = document.createTextNode("");
        htmlElement.appendChild(this.textNode);
        document.getElementById('mute').onclick = this.mute;
        document.getElementById('unmute').onclick = this.unmute;
        document.getElementById('expand').onclick = this.toggleFullscreen;
        document.getElementById('compress').onclick = this.toggleFullscreen;

        var debugInfo = Gl.gl.getExtension('WEBGL_debug_renderer_info');
        var vendor = Gl.gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        var renderer = Gl.gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        document.getElementById('vendor').textContent = vendor;
        document.getElementById('renderer').textContent = renderer;
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


        /*if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }*/
    }

    private unmute(): void {
        document.getElementById('mute').style.display = 'inline';
        document.getElementById('unmute').style.display = 'none';
        Audio.setVolume(1);
    }

    public private_update(): void {
        this.textNode.nodeValue = Time.getFps() + '';
    }
}