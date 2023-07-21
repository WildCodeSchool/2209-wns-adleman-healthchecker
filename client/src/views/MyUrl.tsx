import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetUrlsByUserIdQuery } from "../graphql/generated/schema";
import Modal from "../components/Modal";

import { formatDate, formatUrl } from "../utils/utils";

interface IResponse {
  latency: number;
  status: number;
  date: string;
}

interface IUrl {
  id: number;
  url: string;
  lastStatus: number;
  lastDate: string;
  lastLatency: number;
  responses: IResponse[];
}

interface IMyUrlProps {
  currentUser: {
    profile: {
      id: number;
      username: string;
      email: string;
      last_connection: Date;
    };
  };
}

interface IUrlId {
  url: string;
  id: number;
}

export default function MyUrl({ currentUser }: IMyUrlProps) {
  let navigate = useNavigate();

  const location = useLocation();
  const fromLogin = location.state?.fromLogin;

  console.log(fromLogin);

  const [urlList, setUrlList] = useState<IUrl[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlListTreshold, setUrlListTreshold] = useState<IUrlId[]>([]);

  const { data, refetch } = useGetUrlsByUserIdQuery();

  useEffect(() => {
    setUrlListTreshold([]);
    refetch();
  }, [currentUser, refetch]);

  useEffect(() => {
    let arrTreshold: IUrlId[] = [];
    data?.getUrlsByUserId.userToUrls.forEach((u) => {
      u.url.responses.forEach((r) => {
        if (
          u.latency_threshold > 0 &&
          u.latency_threshold < r.latency &&
          arrTreshold.filter((el) => {
            return el.id === u.url.id;
          }).length === 0
        )
          arrTreshold.push({ id: u.url.id, url: u.url.url });
      });
    });
    if (arrTreshold.length > 0 && fromLogin) setIsModalOpen(true);
    setUrlListTreshold(arrTreshold);

    if (data?.getUrlsByUserId) {
      let newList = data.getUrlsByUserId.userToUrls.map((u) => {
        let lastLatency = u.url.responses[u.url.responses.length - 1].latency;
        let lastDate = u.url.responses[u.url.responses.length - 1].created_at;
        let lastStatus =
          u.url.responses[u.url.responses.length - 1].response_status;
        let responseList = u.url.responses.map((r) => {
          return {
            latency: r.latency,
            status: r.response_status,
            date: r.created_at,
          };
        });
        return {
          id: u.url.id,
          url: u.url.url,
          responses: responseList,
          lastDate,
          lastStatus,
          lastLatency,
        };
      });
      setUrlList(newList);
    }
  }, [data]);

  function onUrlClick(urlId: number) {
    navigate(`/history/${urlId}`);
  }

  if (!urlList) return <div>No URL added</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="header flex">
          <div>URL</div>
          <div>Latency</div>
          <div>Status</div>
        </div>
        {urlList &&
          urlList.map((u, i) => (
            <div className="row flex" onClick={() => onUrlClick(u.id)} key={i}>
              <div>{formatUrl(u.url)}</div>
              <div>{u.lastLatency}</div>
              <div>{u.lastStatus}</div>
            </div>
          ))}
        {isModalOpen && (
          <Modal
            setIsOpen={setIsModalOpen}
            urls={urlListTreshold}
            onClick={onUrlClick}
          />
        )}
      </div>
    </div>
  );
}
