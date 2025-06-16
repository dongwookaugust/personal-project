import ContentRow from "../components/ContentRow";
import { useContentItems } from "../hooks/useContentItems";

const TestHoverPage = () => {
  const { items, loading, error } = useContentItems(10, "random");

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error!</div>;

  return (
    <div
      style={{ backgroundColor: "#000", minHeight: "100vh", padding: "2rem" }}
    >
      <h1 style={{ color: "white" }}>Hover 테스트</h1>

      {/* ✅ 이건 확인용 박스 */}
      <div
        style={{
          width: "200px",
          height: "300px",
          backgroundColor: "#444",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
        onMouseEnter={() => console.log("Hovered!")}
        onClick={() => console.log("Clicked!")}
      >
        Hover me
      </div>

      {/* ✅ ContentRow도 같이 테스트에 포함시켜야 함 */}
      <ContentRow title="테스트 콘텐츠" items={items} />
    </div>
  );
};

export default TestHoverPage;
