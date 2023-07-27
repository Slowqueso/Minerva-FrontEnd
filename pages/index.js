import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Navbar from "../components/Layout/IndexNavbar/Navbar";
import styles from "./styles.module.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const canvasRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const COLORS = ["#cb59ff", "#23d6ff", "#c8f4fd"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const canvasSize = 600;
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor("0x000000", 0);

    const camera = new THREE.PerspectiveCamera(
      35,
      canvasSize / canvasSize,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 2;

    const scene = new THREE.Scene();
    scene.rotation.y = 0.06;

    const loader = new GLTFLoader();
    loader.load("/assets/minerva-statue/scene.gltf", (gltf) => {
      const model = gltf.scene;
      const bbox = new THREE.Box3().setFromObject(model);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());

      // Move the model so that the origin is at the rear side
      // model.position.x = -center.x - 1;
      // model.position.y = -center.y + size.y / 2;
      model.position.z = -center.z - size.z / 5;
      model.rotation.y = 0;

      scene.add(model);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    renderer.render(scene, camera);
    animate();

    const maxRotation = Math.PI / 8; // limit rotation to 22.5 degrees
    const canvasWidth = canvasSize;
    const canvasHeight = canvasSize;

    const onMouseMove = (event) => {
      const mouseX = event.clientX - window.innerWidth / 2;
      const mouseY = event.clientY - window.innerHeight / 2;
      const rotateX = (mouseY / canvasHeight) * maxRotation;
      const rotateY = (mouseX / canvasWidth) * maxRotation;

      scene.rotation.x = rotateX;
      scene.rotation.y = 0.4 + rotateY;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    const interval = setInterval(() => {
      setHighlightIndex((highlightIndex) => (highlightIndex + 1) % 3);
    }, 2500);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className={styles.page}>
        <header>
          <div className={styles.header_line_wrapper}>
            <h1 className={`unselectable ${styles.header_line}`}>
              <span className={highlightIndex === 0 ? styles.highlight : ""}>
                Decentralized
              </span>
              .
              <span className={highlightIndex === 1 ? styles.highlight : ""}>
                Trustworthy
              </span>
              .
              <span className={highlightIndex === 2 ? styles.highlight : ""}>
                Reliable
              </span>
              .
            </h1>
            <h3 className={styles.header_subline}>
              At Minerva, we strive to bring together the most innovative and
              dedicated individuals to achieve their common goals through our
              decentralized blockchain platform.
            </h3>
          </div>
          <div className={styles.background}>
            <Image src={"/assets/mi.png"} layout="fill"></Image>
          </div>
        </header>
        <section>
          <div className={`flex ${styles.introduction_container}`}>
            <div className={styles.introduction}>
              <h2>Welcome to Minerva</h2>
              <h3>Empowering the Future of Work</h3>
              <p>
                A cutting-edge Blockchain software named after the Greek Goddess
                of Wisdom, School, Commerce, and Justice. Our software is
                designed to revolutionize the employment industry and improve
                the work-from-home culture for the Gen-Z generation. With our
                decentralized blockchain platform, we bring together
                exploratory, innovative, and devoted individuals to accomplish
                their common goals. At Minerva, we believe in the power of
                technology to drive progress and transform the way we work. Join
                us as we embark on this exciting journey towards a brighter
                future for the employment industry.
              </p>

              <Link href={"/login"}>
                <button className={styles.start_button}>
                  <span>Get Started</span>
                </button>
              </Link>
            </div>
            <div className={styles.glow1}>
              <Image src={"/assets/Glow.png"} height={600} width={600}></Image>
            </div>
            <canvas ref={canvasRef} />
          </div>
        </section>
        {/* <h3 className={styles.additional}>Explore Your Potential</h3>
        <div className={styles.timeline_1}>
          <div className={styles.stage_bubble}>1</div>
          <span></span>
          <h3>Upload Your Work</h3>
        </div> */}
        <section className={styles.banner}>
          <h1>Revolutionizing the Employment Industry for Gen-Z</h1>
          <div className={styles.banner_image}>
            <Image
              // layout="fill"
              height={505}
              width={900}
              src={"/assets/Activity-dashboard-home.jpg"}
            ></Image>
          </div>
        </section>
        {/* <div className={styles.timeline_1}>
          <span></span>
          <div className={styles.stage_bubble}>2</div>
          <span></span>
          <h3>Own your work</h3>
        </div> */}
        <section id="proof-of-stake">
          <div className={`flex ${styles.content_container}`}>
            <div className={styles.content}>
              <h1>&deg;1</h1>
              <h2>Proof-of-Stake</h2>
              <h3>Integrity, Security and Non-repudiation</h3>
              <p>
                The Proof-of-Stake in Minerva assures the user with Integrity,
                Security and Non-repudiation of their ideas. Under the
                Proof-of-Stake, the details of the Activity are registered in
                the Blockchain node.The Proof-of-Stake is what assures the owner
                of the activity security about their idea and ensures the
                appropriate implementation. Once an Activity is created or a new
                member joins an existing Activity, a Proof of Stake document is
                generated very similar to a Digital Signature.
              </p>
              <Link href="#proof-of-work">
                <div className={`${styles.go_next} flex`}>
                  <p>Go Next</p>
                  <span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      color={"black"}
                      size="sm"
                    ></FontAwesomeIcon>
                  </span>
                </div>
              </Link>
              {/* <Link href={"/login"}>
              <button className={styles.start_button}>
                <span>Get Started</span>
              </button>
            </Link> */}
            </div>
            <div className={styles.side_image}>
              <Image
                src={"/assets/proof-of-stake.png"}
                height={900}
                width={1000}
              ></Image>
            </div>
          </div>
        </section>
        {/* <div className={styles.timeline_1}>
          <span></span>
          <div className={styles.stage_bubble}>3</div>
          <span></span>
          <h3>Record your Work</h3>
        </div> */}
        <section id="proof-of-work">
          <div className={`flex ${styles.content_container}`}>
            <div className={styles.content}>
              <h1>&deg;2</h1>
              <h2>Proof-of-Work</h2>
              {/* <h3>Integrity, Security and Non-repudiation</h3> */}
              <p>
                Maintaining proof of an individual&apos;s work is a very crucial
                part of Integrity. At Minerva, Proof-of-work for each user in an
                Activity is maintained via Tasks. Similar to Activity, every
                task assigned and completed it registered in the blockchain
                ledger.Establishing Proof-of-work and ensuring the commencement
                of the assigned task plays a very important role in ensuring
                security of the Activity. Smart contracts are self-executing
                contracts with the terms of the agreement between buyer and
                seller being directly written into lines of code. The code and
                the agreements contained therein are stored and replicated on a
                blockchain network.
              </p>
              <Link href="#automated-valuation">
                <div className={`${styles.go_next} flex`}>
                  <p>Go Next</p>
                  <span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      color={"black"}
                      size="sm"
                    ></FontAwesomeIcon>
                  </span>
                </div>
              </Link>

              {/* <Link href={"/login"}>
              <button className={styles.start_button}>
                <span>Get Started</span>
              </button>
            </Link> */}
            </div>
            <div className={styles.side_image}>
              <Image
                src={"/assets/proof-of-work.png"}
                height={900}
                width={1000}
              ></Image>
            </div>
          </div>
        </section>
        {/* <div className={styles.timeline_1}>
          <span></span>
          <div className={styles.stage_bubble}>4</div>
          <span></span>
          <h3>Get Your Business Started</h3>
        </div> */}
        <section>
          <div className={`flex ${styles.introduction_container}`}>
            <div className={styles.introduction}>
              <h2>Automated Valuation</h2>
              <h3>Relative and Intrinsic</h3>
              <p>
                Valuation is the process of determining the present value of a
                company or asset. It involves analyzing a company&apos;s
                financial statements and other relevant information, such as its
                industry and market conditions, to estimate its worth. The
                valuation of a company is a subjective process and the value
                that is arrived at will depend on the assumptions and inputs
                used in the valuation process.
              </p>

              {/* <Link href={"/login"}>
              <button className={styles.start_button}>
                <span>Get Started</span>
              </button>
            </Link> */}
            </div>
            {/* <div className={styles.side_image}>
            <Image
              src={"/assets/proof-of-stake.png"}
              height={900}
              width={1000}
            ></Image>
          </div> */}
          </div>
        </section>
      </section>
    </>
  );
}
