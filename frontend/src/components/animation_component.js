import {React, useEffect, useState} from "react";

import UserService from "../services/user_service";
import SceneComponent from "./scene_component"
import { ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, StandardMaterial, Color3, Texture, AnimationGroup, Animation, Vector2, Path2, Curve3, CSG, PolygonMeshBuilder, SolidParticleSystem } from "@babylonjs/core";

import * as MeshWriter from "meshwriter";
const methodsObj = {
    Vector2, Vector3, Path2, Curve3, Color3, SolidParticleSystem, PolygonMeshBuilder, CSG,
    StandardMaterial, Mesh
};

const onSceneReady = (scene) => {
    // eslint-disable-next-line
    const camera = new ArcRotateCamera("Camera", 0, 0, 15, Vector3.Zero()); // eslint-disable-next-line
    const canvas = scene.getEngine().getRenderingCanvas(); 
    //camera.attachControl(canvas, true);

    const light = new HemisphericLight("hemi", new Vector3(10, 20, 10), scene);
    const light2 = new HemisphericLight("hemi2", new Vector3(-10, -20, -10), scene);

    light.intensity = 0.85;
    light2.intensity = 0.85;

    const sphere = MeshBuilder.CreateSphere("sphere", { "diameter": 4.5 }, scene);
    var myMaterial = new StandardMaterial("myMaterial", scene);
    myMaterial.diffuseTexture = new Texture("./soccer_sph.png", scene);
    sphere.material = myMaterial

    const myShape = [];
    const arrowRadius = 0.75;
    const n = 90;
    const deltaAngle = 2 * Math.PI / n
    for (let i = 0; i <= n; i++) {
        myShape.push(new Vector3(arrowRadius * Math.cos(i * deltaAngle), arrowRadius * Math.sin(i * deltaAngle), 0))

    }
    myShape.push(myShape[0]);

    const arrowHeadLength = 1.5;
    const arrowHeadMaxSize = 1.5;
    const arrowLength = 10;
    const arrowBodyLength = arrowLength - arrowHeadLength;

    const arrow1Start = new Vector3(0.65, 0, 0);
    let arrow1Direction = new Vector3(0, 0, 0.65);
    arrow1Direction.normalize();

    const arrow1BodyEnd = arrow1Start.add(arrow1Direction.scale(arrowBodyLength));
    const arrow1HeadEnd = arrow1BodyEnd.add(arrow1Direction.scale(arrowHeadLength))


    const arrow1Path = [];
    arrow1Path.push(arrow1Start);
    arrow1Path.push(arrow1BodyEnd);
    arrow1Path.push(arrow1BodyEnd)
    arrow1Path.push(arrow1HeadEnd);

    const arrow2Start = new Vector3(-0.65, 0, 0);
    let arrow2Direction = new Vector3(0, 0, -0.65);
    arrow2Direction.normalize();

    const arrow2BodyEnd = arrow2Start.add(arrow2Direction.scale(arrowBodyLength));
    const arrow2HeadEnd = arrow2BodyEnd.add(arrow2Direction.scale(arrowHeadLength))


    const arrow2Path = [];
    arrow2Path.push(arrow2Start);
    arrow2Path.push(arrow2BodyEnd);
    arrow2Path.push(arrow2BodyEnd)
    arrow2Path.push(arrow2HeadEnd);

    const scaling = (index, distance) => {
        switch (index) {
            case 0:
            case 1:
                return 1
            case 2:
                return arrowHeadMaxSize / arrowRadius
            case 3:
                return 0
            default:
                break
        }
    };

    let arrow1 = MeshBuilder.ExtrudeShapeCustom("arrow1", { shape: myShape, path: arrow1Path, updatable: true, scaleFunction: scaling, sideOrientation: Mesh.DOUBLESIDE });
    let arrow2 = MeshBuilder.ExtrudeShapeCustom("arrow2", { shape: myShape, path: arrow2Path, updatable: true, scaleFunction: scaling, sideOrientation: Mesh.DOUBLESIDE });

    const arrowScale = (arrow, shape, path, scale) => {
        const arrowHeadLength = path[3].subtract(path[2]).length();
        const arrowLength = path[3].subtract(path[0]).length() * scale;
        const arrowBodyLength = arrowLength - arrowHeadLength;
        const arrowStart = path[0];

        let arrowDirection = path[1].subtract(path[0]);
        arrowDirection.normalize();

        const arrowBodyEnd = arrowStart.add(arrowDirection.scale(arrowBodyLength));
        const arrowHeadEnd = arrowBodyEnd.add(arrowDirection.scale(arrowHeadLength))

        path[1] = arrowBodyEnd;
        path[2] = arrowBodyEnd;
        path[3] = arrowHeadEnd;

       MeshBuilder.ExtrudeShapeCustom("arrow", { shape: shape, path: path, scaleFunction: scaling, instance: arrow });
    }

    arrowScale(arrow1, myShape, arrow1Path, 0.5);
    arrowScale(arrow2, myShape, arrow2Path, 0.5);

    var material1 = new StandardMaterial(scene);
    material1.alpha = 1;
    material1.diffuseColor = new Color3(0.13, 0.8, 0.22);

    arrow1.material = material1;

    var material2 = new StandardMaterial(scene);
    material2.alpha = 1;
    material2.diffuseColor = new Color3(1, 0, 0);

    arrow2.material = material2;

    var scale = 0.1;
    let Writer = MeshWriter(scene, { scale: scale, defaultFont: "Arial", methods: methodsObj });
    let text1 = new Writer(
        "TransferSite",
        {
            "anchor": "center",
            "letter-height": 20,
            "font-family": "Segoe UI",
            color: "#000000",
            colors: {
                diffuse: "#000000",
                specular: "#000000",
                ambient: "#000000",
                emissive: "#000000",
            },

            "position": {
                "z": -40,
                "y": 0,
                "x": 0
            }
        }
    );

    var SPS = text1.getSPS();
    SPS.mesh.rotation.y = 3 * Math.PI / 2;

    const pivotAt = new Vector3(0, 0, 0);
    const relativePosition = pivotAt.subtract(SPS.mesh.position)
    SPS.mesh.setPivotPoint(relativePosition)

    const animY = new Animation("animationY", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    const yKeys = [];
    const y2Keys = [];

    yKeys.push({
        frame: 0,
        value: 0
    });
    yKeys.push({
        frame: 300,
        value: 2 * Math.PI
    });
    yKeys.push({
        frame: 600,
        value: 4 * Math.PI
    });
    yKeys.push({
        frame: 900,
        value: 6 * Math.PI
    });
    yKeys.push({
        frame: 1000,
        value: 6 * Math.PI
    });
    animY.setKeys(yKeys);

    const animY2 = new Animation("animationY", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    y2Keys.push({
        frame: 0,
        value: 3 * Math.PI / 2
    });
    y2Keys.push({
        frame: 300,
        value: 2 * Math.PI + 3 * Math.PI / 2
    });
    y2Keys.push({
        frame: 600,
        value: 4 * Math.PI + 3 * Math.PI / 2
    });
    y2Keys.push({
        frame: 900,
        value: 6 * Math.PI + 3 * Math.PI / 2
    });
    y2Keys.push({
        frame: 1000,
        value: 6 * Math.PI + 3 * Math.PI / 2
    });
    animY2.setKeys(y2Keys);

    const animX = new Animation("animationX", "rotation.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const xKeys = [];

    xKeys.push({
        frame: 0,
        value: 0
    });

    xKeys.push({
        frame: 900,
        value: 2 * Math.PI
    });
    xKeys.push({
        frame: 1000,
        value: 2 * Math.PI
    });
    animX.setKeys(xKeys);

    const animX2 = new Animation("animationX", "rotation.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const x2Keys = [];

    x2Keys.push({
        frame: 0,
        value: 0
    });

    x2Keys.push({
        frame: 900,
        value: -2 * Math.PI
    });
    x2Keys.push({
        frame: 1000,
        value: -2 * Math.PI
    });
    animX2.setKeys(x2Keys);


    var animationGroup = new AnimationGroup("my group");
    animationGroup.addTargetedAnimation(animX, arrow1);
    animationGroup.addTargetedAnimation(animX, arrow2);
    animationGroup.addTargetedAnimation(animX, sphere);
    animationGroup.addTargetedAnimation(animX2, SPS.mesh);
    animationGroup.addTargetedAnimation(animY, arrow1);
    animationGroup.addTargetedAnimation(animY, arrow2);
    animationGroup.addTargetedAnimation(animY, sphere);
    animationGroup.addTargetedAnimation(animY2, SPS.mesh);

    animationGroup.normalize(0, 1000);
    animationGroup.play(true, 1, 0, 1000);



    scene.clearColor = new Color3(25 / 255, 135 / 255, 84 / 255);

};

export default function Home() {

    const [content, setContent] = useState()

    function componentDidMount() {
        UserService.getPublicContent().then(
            response => {
                setContent({
                    content: response.data
                });
            },
            error => {
                setContent({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    useEffect(() => {
        componentDidMount()
    }, [])

    return(
    <div className="container" style={{ padding: "3rem 0rem" }}>
        <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas" />
    </div>
    )
}