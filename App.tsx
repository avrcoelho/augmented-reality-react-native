import React, { useEffect } from "react";
import { AR } from "expo";
import ExpoTHREE, { AR as ThreeAR, THREE } from "expo-three";
import { View as GraphicsView } from "expo-graphics";

export default function App() {
  let renderer;
  let scene;
  let camera;

  useEffect(() => {
    ThreeAR.suppressWarnings();
  }, []);

  async function googleCube() {
    const texture = await ExpoTHREE.loadAsync(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    );
    const googleImage = new THREE.MeshPhongMaterial({ map: texture });

    const google = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      googleImage
    );
    google.position.z = -0.4;

    scene.add(google);
  }

  async function onContextCreate({ gl, scale: pixelRatio, width, height }) {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Create a 3D renderer
    renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height
    });

    // We will add all of our meshes to this scene.
    scene = new THREE.Scene();
    // This will create a camera texture and use it as the background for our scene
    scene.background = new ThreeAR.BackgroundTexture(renderer);
    // Now we make a camera that matches the device orientation.
    // Ex: When we look down this camera will rotate to look down too!
    camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    scene.add(new THREE.AmbientLight(0xffffff));

    googleCube();
  }

  // When the phone rotates, or the view changes size, this method will be called.
  function onResize({ x, y, scale, width, height }) {
    // Let's stop the function if we haven't setup our scene yet
    if (!renderer) {
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  }

  // Called every frame.
  function onRender() {
    renderer.render(scene, camera);
  }

  return (
    <GraphicsView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
      onRender={onRender}
      onResize={onResize}
      isArEnabled
      isArRunningStateEnabled
      isArCameraStateEnabled
      arTrackingConfiguration={"ARWorldTrackingConfiguration"}
    />
  );
}
