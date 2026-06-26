import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type Series = {
  color: string;
  label: string;
  values: number[];
};

function buildPath(values: number[], width: number, height: number, min: number, max: number): string {
  if (!values.length) return '';
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function LineChart({
  labels,
  scaleEach,
  series,
  title,
}: {
  labels?: string[];
  scaleEach?: boolean;
  series: Series[];
  title?: string;
}) {
  const width = 320;
  const height = 180;
  const filteredSeries = series.filter((item) => item.values.some((value) => Number.isFinite(value)));

  if (!filteredSeries.length) {
    return (
      <View style={styles.emptyWrap}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.emptyText}>No chart data yet.</Text>
      </View>
    );
  }

  const allValues = filteredSeries.flatMap((item) => item.values);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  return (
    <View style={styles.wrap}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Svg height={height + 20} viewBox={`0 0 ${width} ${height + 20}`} width="100%">
        <Rect fill="#f8fafc" height={height} rx={16} width={width} x={0} y={0} />
        <Line stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={width} y1={height / 2} y2={height / 2} />
        {filteredSeries.map((item) => {
          const min = scaleEach ? Math.min(...item.values) : globalMin;
          const max = scaleEach ? Math.max(...item.values) : globalMax;
          if (item.values.length === 1) {
            return <Circle cx={width / 2} cy={height / 2} fill={item.color} key={item.label} r={4} />;
          }
          return <Path d={buildPath(item.values, width, height, min, max)} fill="none" key={item.label} stroke={item.color} strokeWidth={2.5} />;
        })}
      </Svg>
      <View style={styles.legend}>
        {filteredSeries.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
      {labels?.length ? (
        <View style={styles.axisRow}>
          <Text style={styles.axisText}>{labels[0] ?? '--'}</Text>
          <Text style={styles.axisText}>{labels[Math.floor(labels.length / 2)] ?? '--'}</Text>
          <Text style={styles.axisText}>{labels[labels.length - 1] ?? '--'}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisText: {
    color: '#64748b',
    fontSize: 11,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  emptyWrap: {
    gap: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendSwatch: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  legendText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  wrap: {
    gap: 10,
  },
});


