import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen cornsilk p-8 flex items-center justify-center">
      <div className="max-w-3xl text-lg font-medium text-black-forest">
        <div className="flex items-center gap-8 mb-8">
          {/* <div className="flex justify-center items-center w-56 h-56 bg-sunlit-clay rounded-2xl">
            <div className="flex justify-center items-center w-52 h-52 bg-copperwood rounded-xl"> */}
          <Image
            src="/me2.jpg"
            alt="Xander Beaulac"
            width={3024}
            height={4032}
            className="rounded-lg w-48 h-48 object-cover"
          />
          {/* </div>
          </div> */}
          <div>
            <div className="font-bold text-4xl">Xander Beaulac</div>
            <div className="text-xl font-semibold opacity-80">
              Software engineer, founder, and recording artist
            </div>
          </div>
        </div>
        Hi, I'm Xander Beaulac
        <br />
        I build software that helps people
        <br />
        I also make music with my friends
        <br />
        I also like to run, ski, and hike in the mountains
        <br />
        My passions for tech and music began when I was 12
        <br />
        When I was 13, I released a meme rap song called{" "}
        <a
          href="https://open.spotify.com/track/3IpWC0lKJEy3PjOPgImN59?si=d87ee5fe424e4b60"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          Krusty Krab
        </a>{" "}
        that blew up
        <br />
        Starting highschool, I developed a{" "}
        <a
          href="https://github.com/xbeaulac/incline-village-access"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          mobile app
        </a>{" "}
        to manage access to my local beach
        <br />
        When I was 16, I taught myself pixel art and generated an{" "}
        <a
          href="https://github.com/xbeaulac/pixel-people"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          NFT collection
        </a>
        <br />
        At 17, I learned more about web development and designed a{" "}
        <a
          href="https://github.com/xbeaulac/usahomeloans-crm"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          CRM
        </a>{" "}
        for a family friend
        <br />
        On my 18th birthday, I released an{" "}
        <a
          href="https://open.spotify.com/album/2J8MvpbTonmhKTDkaFnobZ?si=3RH98G9pSTSmmSR3Fwj-og"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          album
        </a>{" "}
        of songs I had made over the years
        <br />
        When I started college, I founded the{" "}
        <a
          href="https://www.instagram.com/runningclubcu/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          Chapman Run Club
        </a>{" "}
        because they didn't have one
        <br />
        I took a gap semester and moved to SF having never visited and knowing
        no one
        <br />
        After meeting a founder on the street, I build their landing page 2
        hours later
        <br />I joined their team and helped build{" "}
        <a
          href="https://drafted.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          Drafted
        </a>
        , an AI floor plan generator
        <br />
        Last winter, I was a ski instructor and loved teaching and being outside
        on my feet
        <br />
        Back at school, I've been working on{" "}
        <a
          href="https://stoodious.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          Stoodious
        </a>
        , a degree planner for me and my friends
        <br />
        This summer, I'd love to help you with your project
        <br />
        Check my{" "}
        <a
          href="https://docs.google.com/document/d/16AFFCZI-t5xr9_4XJtL9KRd-Lrt2qV9i/edit?usp=sharing&ouid=111632038240813900288&rtpof=true&sd=true"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-olive-leaf transition-colors"
        >
          resumé
        </a>
        <br />
        Send me a{" "}
        <a
          href="sms:+16677863265"
          className="underline hover:text-olive-leaf transition-colors"
        >
          text
        </a>{" "}
        or an{" "}
        <a
          href="mailto:hello@xanderbeaulac.com"
          className="underline hover:text-olive-leaf transition-colors"
        >
          email
        </a>
      </div>
    </div>
  );
}
