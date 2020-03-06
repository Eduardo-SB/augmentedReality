import React, { useEffect } from 'react';
import { Asset } from 'expo-asset';
import { AR } from 'expo';
import ExpoTHREE, {THREE} from 'expo-three';
import * as ThreeAR from 'expo-three-ar';
import { View as GraphicsView } from 'expo-graphics';

export default function App(){
  let renderer;
  let camera;
  let geometry;
  let material;
  let cube;
  let points;

  useEffect(() => {
    THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings()
  }, []);

  async function onContextCreate({ gl, scale: pixelRatio, width, height }){
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    scene = new THREE.Scene();
    scene.background = new ThreeAR.BackgroundTexture(renderer);
    camera = new ThreeAR.Camera(width, height, 0.01, 1000);
    
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
    });
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.z = -0.4
    scene.add(cube);
    
    scene.add(new THREE.AmbientLight(0xffffff));

    points = new ThreeAR.Points();
    scene.add(points);

    setInterval(()=>{
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1   ;
    }, 50)
  }

  function onResize ({ x, y, scale, width, height }){
  
    if (!renderer) {
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  function onRender() {
    points.update()
    renderer.render(scene, camera);
  };

  return (
    <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        onRender={onRender}
        onResize={onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={'ARWorldTrackingConfiguration'}
      />
  )
}