import { Avatar, Card, Typography, Button, Tag, Space, Tooltip } from 'antd';
import { UserOutlined, MailOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  picture?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  skills?: string[];
  joinDate?: string;
}

interface TeamCardProps {
  name: string;
  role: string;
  picture?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  skills?: string[];
  joinDate?: string;
  onContact?: (email: string) => void;
  showDetails?: boolean;
}

export const TeamCard = ({
  name,
  role,
  picture,
  email,
  linkedin,
  github,
  bio,
  skills = [],
  joinDate,
  onContact,
  showDetails = false,
}: TeamCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    if (showDetails) {
      setShowFullBio(true);
    }
  }, [showDetails]);

  const handleContact = () => {
    if (email && onContact) {
      onContact(email);
    } else if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      hoverable
      className="team-card"
      style={{
        width: 300,
        margin: '16px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 8px 16px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cover={
        <div
          style={{
            height: 200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {picture ? (
            <Avatar
              size={120}
              src={picture}
              icon={<UserOutlined />}
              style={{ border: '4px solid white' }}
            />
          ) : (
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
                border: '4px solid white',
                fontSize: '48px',
              }}
            >
              {getInitials(name)}
            </Avatar>
          )}
        </div>
      }
      actions={[
        email && (
          <Tooltip title="Email">
            <Button
              type="text"
              icon={<MailOutlined />}
              onClick={handleContact}
              aria-label="Email"
            />
          </Tooltip>
        ),
        linkedin && (
          <Tooltip title="LinkedIn">
            <Button
              type="text"
              icon={<LinkedinOutlined />}
              onClick={() => window.open(linkedin, '_blank')}
              aria-label="LinkedIn"
            />
          </Tooltip>
        ),
        github && (
          <Tooltip title="GitHub">
            <Button
              type="text"
              icon={<GithubOutlined />}
              onClick={() => window.open(github, '_blank')}
              aria-label="GitHub"
            />
          </Tooltip>
        ),
      ].filter(Boolean)}
    >
      <Meta
        title={
          <div>
            <Text strong style={{ fontSize: '18px' }}>
              {name}
            </Text>
            {joinDate && (
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Joined {new Date(joinDate).getFullYear()}
              </Text>
            )}
          </div>
        }
        description={
          <div>
            <Tag color="blue" style={{ marginBottom: '8px' }}>
              {role}
            </Tag>
            {bio && (
              <Paragraph
                ellipsis={!showFullBio ? { rows: 2, expandable: true, symbol: 'more' } : false}
                style={{ marginBottom: '8px', minHeight: '40px' }}
              >
                {bio}
              </Paragraph>
            )}
            {skills && skills.length > 0 && (
              <Space wrap size={[8, 8]}>
                {skills.map((skill, index) => (
                  <Tag key={index} color="geekblue">
                    {skill}
                  </Tag>
                ))}
              </Space>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default TeamCard;
